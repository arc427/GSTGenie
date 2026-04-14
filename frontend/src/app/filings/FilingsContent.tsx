"use client";

import { useState, useEffect } from "react";
import { Invoice } from "../../../types/invoice";
// PDF Libraries are imported here (Client-side)
import jsPDF from "jspdf"; 
import autoTable from "jspdf-autotable"; 
import Sidebar from "../../components/Sidebar"; // Still needed for the layout structure

export default function FilingsContent() {
    const [totalITC, setTotalITC] = useState(0);
    const [filingStatus, setFilingStatus] = useState("draft"); 
    const [liability, setLiability] = useState(0);

    const BUSINESS_NAME = "TRENDZ BOUTIQUE";
    const BUSINESS_GSTIN = "29TREND1234F1Z9"; 

    useEffect(() => {
        // Fetch ITC from Invoices (REAL DATA ONLY)
        async function fetchITC() {
            try {
                const res = await fetch('/api/invoices');
                const data = await res.json();
                if (data.invoices) {
                    let itc = 0;
                    data.invoices.forEach((inv: Invoice) => {
                        itc += parseFloat(inv.gstAmount?.replace(/[₹,]/g, '') || "0");
                    });
                    setTotalITC(itc); 
                }
            } catch (e) { console.error(e); }
        }
        fetchITC();

        // Fetch Liability from User Input (Reports Page)
        const savedSales = localStorage.getItem("userSalesInput");
        if (savedSales) {
            setLiability(parseFloat(savedSales) * 0.18);
        } else {
            setLiability(200000 * 0.18); // Default fallback
        }

    }, []);

    const handleFileReturn = () => {
        setFilingStatus("filing");
        setTimeout(() => {
            setFilingStatus("filed");
        }, 2500);
    };

    // --- PDF GENERATION LOGIC ---
    const handleDownloadPDF = () => {
        const doc = new jsPDF(); 

        // Header Details
        doc.setFontSize(18);
        doc.text(`FORM GSTR-3B DRAFT (Summary)`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Legal Name: ${BUSINESS_NAME}`, 14, 28);
        doc.text(`GSTIN: ${BUSINESS_GSTIN}`, 14, 33);
        doc.text(`Period: November 2025`, 14, 38);
        doc.setLineWidth(0.5);
        doc.line(14, 40, 196, 40); 

        // Summary Table Data
        const tableData = [
            ["Total Liability (Sales)", `Rs. ${liability.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
            ["Eligible ITC (Purchases)", `Rs. ${totalITC.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
            ["Net Tax Payable", `Rs. ${netPayable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
        ];

        (autoTable as any)(doc, {
            startY: 45,
            head: [['Description', 'Amount']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 10 }
        });
        
        doc.save("GSTR-3B_Draft_Nov2025.pdf");
    };
    // --- END PDF LOGIC ---

    const netPayable = Math.max(0, liability - totalITC);

    return (
        // --- JSX for the Active Filing Section ---
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-700">Current Period: November 2025</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 animate-pulse">
              🤖 Auto-Drafted by AI
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10">
              {/* Data Columns */}
              <div><p className="text-xs font-bold text-slate-400 uppercase">Total Liability (Sales)</p><h3 className="text-2xl font-bold text-slate-800 mt-1">₹{liability.toLocaleString()}</h3><p className="text-xs text-slate-500 mt-2">Calculated from Sales Input</p></div>
              <div className="border-l border-slate-100 pl-8"><p className="text-xs font-bold text-slate-400 uppercase">Eligible ITC (Purchases)</p><h3 className="text-2xl font-bold text-green-600 mt-1">₹{totalITC.toLocaleString()}</h3><p className="text-xs text-slate-500 mt-2">Exact sum of uploads</p></div>
              <div className="border-l border-slate-100 pl-8"><p className="text-xs font-bold text-slate-400 uppercase">Net Tax Payable</p><h3 className="text-3xl font-bold text-blue-600 mt-1">₹{netPayable.toLocaleString()}</h3><p className="text-xs text-slate-500 mt-2">Due by 20th Dec</p></div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex justify-end gap-4">
              
              <button 
                onClick={handleDownloadPDF} 
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-300 text-sm font-medium"
              >
                Preview Summary PDF
              </button>
              
              <button 
                onClick={handleFileReturn}
                disabled={filingStatus !== "draft"}
                className={`
                  px-6 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2
                  ${filingStatus === "filed" ? "bg-green-600 cursor-default" : "bg-blue-600 hover:bg-blue-700"}
                `}
              >
                {filingStatus === "draft" && <><span>🚀</span> File GSTR-3B Now</>}
                {filingStatus === "filing" && <>Processing...</>}
                {filingStatus === "filed" && <><span>✓</span> Filed Successfully!</>}
              </button>
            </div>
          </div>
        </section>
        // --- END OF JSX ---
    );
}