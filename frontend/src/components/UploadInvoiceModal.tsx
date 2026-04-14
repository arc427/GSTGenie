"use client";

import { useState, FormEvent } from "react";
// ✅ IMPORT SHARED TYPES
import { Invoice, Insight } from "../types/invoice";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddInvoice: (invoice: Invoice) => void;
};

// ✅ Define the shape of data coming from the AI Backend
interface OCRData {
  total?: string;
  taxableValue?: string;
  supplier?: string;
  gstin?: string;
  date?: string;
  invoiceNumber?: string;
}

interface AgentWorkflow {
  status?: string;
  riskScore?: number;
  insights?: Insight[];
}

// =========================================
// HELPER: Generate Insights (Fallback logic)
// =========================================
const generateClientSideInsights = (aiData: OCRData): Insight[] => {
  const insights: Insight[] = [];
  
  const total = parseFloat(aiData.total || "0");
  const taxable = parseFloat(aiData.taxableValue || "0");
  const gstAmount = total > taxable ? total - taxable : 0;
  
  const supplier = aiData.supplier || "Unknown Supplier";
  const gstin = aiData.gstin;

  insights.push({
    type: "summary",
    title: "Invoice Extracted",
    description: `Processed invoice from ${supplier}.`,
    priority: "low",
  });

  if (gstAmount > 0) {
    insights.push({
      type: "action",
      title: "Potential ITC Available",
      description: `Detected ₹${gstAmount.toFixed(2)} in tax.`,
      priority: "medium",
    });
  }

  if (!gstin) {
    insights.push({
      type: "risk",
      title: "Missing GSTIN",
      description: `Supplier GSTIN is missing.`,
      priority: "high",
    });
  }

  return insights;
};

// =========================================
// MAIN COMPONENT
// =========================================
export default function UploadInvoiceModal({
  isOpen,
  onClose,
  onAddInvoice,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      // ✅ Use Proxy URL for Cloud environment
      const res = await fetch("/api/flask/agent/vision-upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed: ${res.status} ${txt}`);
      }

      const json = await res.json();
      
      // 1. Extract Data
      const aiData = (json.data?.parsed || {}) as OCRData;
      const workflow = (json.data?.workflow || {}) as AgentWorkflow;

      // 2. Calculate Numbers
      const totalNum = parseFloat(aiData.total || "0");
      const taxableNum = parseFloat(aiData.taxableValue || "0");
      const gstNum = totalNum > taxableNum ? totalNum - taxableNum : 0;

      // 3. Determine Status & Insights (Agentic Logic)
      // If the backend Agent made a decision, use it. Otherwise default to "Processed".
      const finalStatus = workflow.status || "Processed";
      
      // If the backend Agent generated insights, use them. Otherwise use frontend fallback.
      const finalInsights = (workflow.insights && workflow.insights.length > 0) 
        ? workflow.insights 
        : generateClientSideInsights(aiData);

      // 4. Create the Invoice Object
      onAddInvoice({
        id: `INV-${Date.now()}`,
        date: aiData.date || new Date().toLocaleDateString("en-IN"),
        supplier: aiData.supplier || "Unknown Supplier",
        gstin: aiData.gstin || "-", // ✅ Map GSTIN
        
        gstAmount: `₹${gstNum.toFixed(2)}`,
        totalAmount: totalNum ? `₹${totalNum.toFixed(2)}` : "₹0",
        
        status: finalStatus as any, // ✅ Use Agent's Status (Auto-Approved/Action Required)
        insights: finalInsights,    // ✅ Use Agent's Insights
      });

      setLoading(false);
      setFile(null);
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setLoading(false);
      alert("Upload failed. Ensure Backend is running on Port 5000.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Upload Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || loading}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
            >
              {loading ? "Agentic Analysis..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}