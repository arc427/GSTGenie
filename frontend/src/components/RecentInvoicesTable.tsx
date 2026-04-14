type InvoiceRow = {
    id: string;
    date: string;
    supplier: string;
    gstExtracted: string;
    status: string;
  };
  
  const SAMPLE_INVOICES: InvoiceRow[] = [
    {
      id: "INV-2023-008",
      date: "02/09/2023",
      supplier: "Tech Solutions",
      gstExtracted: "₹12,500",
      status: "₹1,875",
    },
    {
      id: "INV-2023-009",
      date: "03/09/2023",
      supplier: "Cloud Nexus",
      gstExtracted: "₹8,900",
      status: "Processed",
    },
  ];
  
  export function RecentInvoicesTable() {
    return (
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Recent Invoices &amp; AI Processing
        </h2>
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2">Invoice ID</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Supplier</th>
                <th className="text-right px-4 py-2">GST Extracted</th>
                <th className="text-right px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_INVOICES.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t border-slate-100 even:bg-slate-50/50"
                >
                  <td className="px-4 py-2">{inv.id}</td>
                  <td className="px-4 py-2">{inv.date}</td>
                  <td className="px-4 py-2">{inv.supplier}</td>
                  <td className="px-4 py-2 text-right">{inv.gstExtracted}</td>
                  <td className="px-4 py-2 text-right">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  