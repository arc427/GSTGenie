"use client";

import { Invoice } from "../types/invoice";

type Props = {
  invoices?: Invoice[];
};

export function InvoiceTable({ invoices = [] }: Props) {
  if (invoices.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-slate-300 rounded-xl bg-slate-50">
        <p className="text-slate-500 text-sm">
          No invoices yet. Upload one to start.
        </p>
      </div>
    );
  }

  // Helper: Color-code the Agent's Decision
  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("approved")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s.includes("review")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (s.includes("action") || s.includes("risk")) return "bg-red-100 text-red-700 border-red-200";
    return "bg-slate-100 text-slate-700 border-slate-200"; // Default "Processed"
  };

  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* HEADER */}
          <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">GSTIN</th>
              <th className="px-6 py-4 text-right">Tax Amount</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-right">Agent Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="hover:bg-slate-50 transition-all duration-200"
              >
                {/* Invoice ID */}
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                  {inv.id}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-slate-700">{inv.date}</td>

                {/* Supplier */}
                <td className="px-6 py-4 font-medium text-slate-900">
                  {inv.supplier}
                </td>

                {/* GSTIN */}
                <td className="px-6 py-4 font-mono text-xs text-slate-500">
                  {inv.gstin || "-"}
                </td>

                {/* GST Amount */}
                <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                  {inv.gstAmount}
                </td>

                {/* Total Amount */}
                <td className="px-6 py-4 text-right font-bold text-slate-800">
                  {inv.totalAmount}
                </td>

                {/* Status & Badges */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    
                    {/* AI Badge */}
                    {inv.insights && inv.insights.length > 0 && (
                      <span className="text-lg" title="AI Insights Available">✨</span>
                    )}

                    {/* TDS Badge */}
                    {inv.tdsAmount && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                        TDS
                      </span>
                    )}

                    {/* TCS Badge */}
                    {inv.tcsAmount && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-700 border border-teal-200">
                        TCS
                      </span>
                    )}

                    {/* Agent Status (Color Coded) */}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(inv.status)}`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}