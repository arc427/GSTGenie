import { invoicesDB } from "../utils/store.js";

// Helper: Convert backend data → frontend table format
const toFrontendShape = (inv) => {
  
  // 1. Read the FLATTENED fields directly
  const rawTotal = inv.totalAmount || 0;
  const rawGst = inv.gstAmount || 0;

  return {
    id: inv.id.toString(),
    
    // Read directly (with fallbacks just in case)
    date: inv.date || new Date().toLocaleDateString("en-IN"),
    supplier: inv.supplier || "Unknown Supplier",
    gstin: inv.gstin || "-", 

    // Format currency
    gstAmount: `₹${parseFloat(rawGst).toFixed(2)}`,
    totalAmount: `₹${parseFloat(rawTotal).toFixed(2)}`,
    
    status: inv.status || "Processed",
    tdsAmount: null,
    tcsAmount: null,
    insights: inv.insights || [],
  };
};

export const getAllInvoices = (req, res) => {
  console.log(`📡 Fetching ${invoicesDB.length} invoices from memory...`);
  
  // Debug: Print the first item to ensure data exists
  if (invoicesDB.length > 0) {
      console.log("First Item in DB:", invoicesDB[0]);
  }

  const formattedInvoices = invoicesDB.map((inv) => toFrontendShape(inv));
  return res.status(200).json({ invoices: formattedInvoices });
};

export const getInvoiceById = (req, res) => {
  const id = Number(req.params.id);
  const invoice = invoicesDB.find((inv) => inv.id === id);

  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  return res.status(200).json({ invoice: toFrontendShape(invoice) });
};

export const uploadInvoice = async (req, res) => {
    return res.status(200).json({ message: "Use /api/agent/vision-upload" });
};