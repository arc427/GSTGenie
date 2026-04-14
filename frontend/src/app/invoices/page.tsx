"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { InvoiceTable } from "../../components/InvoiceTable"; 
import UploadInvoiceModal from "../../components/UploadInvoiceModal";
import Toast from "../../components/Toast";
import { Invoice, Insight } from "../../types/invoice"; 
import InsightsPanel from "../../components/InsightsPanel";

// The shape of data coming from the Backend
type BackendInvoice = {
  id: string;
  date: string;
  supplier: string;
  gstin: string;
  totalAmount: string; // Backend sends "₹78500.00"
  gstAmount: string;   // Backend sends "₹10650.93"
  status: string;
  insights: Insight[];
};

export default function InvoicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // -------- Fetch invoices from backend --------
  useEffect(() => {
    async function fetchInvoices() {
      try {
        // ✅ FIX 1: Correct URL (Remove the extra '/api')
        // The rewrite rule in next.config is '/api/flask/:path*' -> '...:5000/api/:path*'
        // So we just need '/api/flask/invoices'
        const res = await fetch("/api/flask/invoices"); 
        
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

        const data = await res.json();

        if (Array.isArray(data.invoices)) {
          // ✅ FIX 2: Trust the Backend Data directly
          // We don't need to re-calculate numbers here. The backend already formatted them.
          const formatted = data.invoices.map((inv: BackendInvoice): Invoice => ({
            id: inv.id,
            date: inv.date,
            supplier: inv.supplier,
            gstin: inv.gstin,
            totalAmount: inv.totalAmount, // Use directly
            gstAmount: inv.gstAmount,     // Use directly
            status: (inv.status as any) || "Processed",
            insights: inv.insights || [] 
          }));

          setInvoices(formatted);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        console.error("Failed to load invoices:", err);
      }
    }

    fetchInvoices();
  }, []);

  const handleAddInvoice = (inv: Invoice) => {
    setInvoices((prev) => [inv, ...prev]);
    
    const count = inv.insights?.length || 0;
    setToastMessage(`Processed! Found ${count} AI insights.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const latestInsights = invoices.length > 0 ? invoices[0].insights : [];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <main className="flex-1 py-6 px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Invoices</h1>
            <p className="text-xs text-slate-500 mt-1">
              All invoices processed by your AI co-pilot. Upload to auto-extract
              GST, vendor info & ITC.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 shadow-sm shadow-blue-500/40"
          >
            Upload Invoice
          </button>
        </div>

        <InsightsPanel insights={latestInsights} />

        <InvoiceTable invoices={invoices} />

        <UploadInvoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddInvoice={handleAddInvoice}
        />

        <Toast
          message={toastMessage}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </main>
    </div>
  );
}