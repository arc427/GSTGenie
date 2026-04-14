// Placeholder model for future MongoDB integration (Mongoose example)
// For MVP we use in-memory store. Add this when switching to DB.

export const InvoiceSchema = {
    invoiceNumber: { type: String },
    date: { type: String },
    supplier: { type: String },
    supplierGSTIN: { type: String },
    taxableValue: { type: Number },
    gstRate: { type: Number },
    cgst: { type: Number },
    sgst: { type: Number },
    total: { type: Number },
    filePath: { type: String },
    createdAt: { type: Date, default: Date.now }
  };
  