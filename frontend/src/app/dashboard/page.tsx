"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { DashboardCard } from "../../components/DashboardCard";
import { InvoiceTable } from "../../components/InvoiceTable"; 
import { FilingActions } from "../../components/FilingActions";
import { Invoice, Insight } from "../../types/invoice"; 

// Helper type to match Backend JSON
type BackendInvoice = {
  id: number | string;
  date: string;
  supplier: string;
  gstin: string;
  totalAmount: string;
  gstAmount: string;
  status: string;
  insights: Insight[];
  
  // Optional legacy fields
  ocrData?: { date?: string; supplier?: string; totalAmount?: number | string };
  gst?: { amount?: number | string };
  tds?: { amount?: number };
  tcs?: { amount?: number };
};

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalITC, setTotalITC] = useState(0);

  // 1. FETCH REAL DATA
  useEffect(() => {
    async function fetchRecent() {
      try {
        // Use Proxy URL
        const res = await fetch('/api/flask/invoices');
        const data = await res.json();
        
        if (data.invoices && Array.isArray(data.invoices)) {
          const formatted = data.invoices.map((inv: BackendInvoice): Invoice => {
            const tdsVal = inv.tds?.amount || 0;
            const tcsVal = inv.tcs?.amount || 0;

            return {
              // ✅ FIX: Safer ID conversion
              id: inv.id?.toString() || `INV-${Math.random().toString(36).substr(2, 9)}`,
              
              date: inv.date || inv.ocrData?.date || "N/A",
              supplier: inv.supplier || inv.ocrData?.supplier || "Unknown",
              gstin: inv.gstin || "-",
              
              // ✅ FIX: Ensure these are always strings
              gstAmount: inv.gstAmount || "₹0",
              totalAmount: inv.totalAmount || "₹0",
              
              status: (inv.status as any) || "Processed",
              insights: inv.insights || [],
              
              // Map Badge Data
              tdsAmount: tdsVal > 0 ? `₹${tdsVal}` : undefined,
              tcsAmount: tcsVal > 0 ? `₹${tcsVal}` : undefined,
            };
          });
          
          setInvoices(formatted);

          // ✅ FIX: Safer Math calculation
          const sumITC = formatted.reduce((acc, curr) => {
            // Ensure gstAmount exists before replacing
            const safeString = curr.gstAmount || "0";
            const val = parseFloat(safeString.replace(/[₹,]/g, ""));
            return acc + (isNaN(val) ? 0 : val);
          }, 0);
          
          setTotalITC(sumITC);
        }
      } catch (e) {
        console.error("Dashboard fetch error", e);
      }
    }
    fetchRecent();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 py-6 px-8">
        {/* Greeting */}
        <section className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
            Welcome, Sarah! Your AI Co-Pilot is active.
          </h1>
        </section>

        {/* Top stat cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DashboardCard
            title="Unclaimed ITC Identified"
            // ✅ Format the calculated number with commas
            value={`₹${totalITC.toLocaleString('en-IN')}`}
            subtitle="Based on uploaded invoices"
            accent="green"
          />
          <DashboardCard
            title="GSTR-1 Due"
            value="5 Days"
            subtitle="Due on Sep 11"
            accent="red"
          />
          <DashboardCard
            title="Last GSTR-3B"
            value="Filed"
            subtitle="Filed on Aug 20"
            accent="blue"
          />
        </section>

        {/* The Invoice Table */}
        <section className="mb-6">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-slate-800">Recent Invoices & AI Processing</h2>
             <span className="text-xs text-slate-500">Live Data</span>
           </div>
           
           <InvoiceTable invoices={invoices.slice(0, 5)} />
        </section>

        {/* Agentic actions */}
        <FilingActions />

        {/* Upload button (Visual Only) */}
        <section className="mt-4">
          <button className="px-5 py-2 rounded-lg border border-sky-400 text-sky-600 text-sm font-medium bg-white hover:bg-sky-50 shadow-sm">
            Upload New Invoice
          </button>
        </section>
      </main>
    </div>
  );
}