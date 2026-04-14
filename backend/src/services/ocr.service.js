// backend/src/services/ocr.service.js

// ✅ 1. Accept 'originalName' to detect Tech/Scrap/Food
export const extractGSTData = async (filePath, originalName = "") => {
  
  // Simulate "Scanning" delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log(`Processing Mock OCR for: ${originalName}`);
  
  const lowerName = originalName.toLowerCase();
  let data = {};

  // --- SCENARIO 1: Tech/Services (Triggers TDS Badge) ---
  if (lowerName.includes("tech") || lowerName.includes("service") || lowerName.includes("consulting")) {
    data = {
      supplier: "Tech Solutions Pvt Ltd",
      gstin: "29TECH8888B1Z2",
      totalAmount: 85000, // > 30k triggers TDS logic
      taxable: 72033.90,
      tax: 12966.10,
      date: "2025-11-20",
      category: "Technical Services" // <--- Critical for Tax Service
    };
  } 
  // --- SCENARIO 2: Scrap/E-com (Triggers TCS Badge) ---
  else if (lowerName.includes("scrap") || lowerName.includes("swiggy")) {
    data = {
      supplier: "Swiggy Business",
      gstin: "29SWIG9999C1Z1",
      totalAmount: 5000,
      taxable: 4761.90,
      tax: 238.10,
      date: "2025-11-25",
      category: "Scrap Sale" // <--- Critical for Tax Service
    };
  } 
  // --- SCENARIO 3: Food/Travel (Triggers AI Warning) ---
  else if (lowerName.includes("starbucks") || lowerName.includes("uber")) {
    data = {
      supplier: "Tata Starbucks Pvt Ltd",
      gstin: "29TATA9999C1Z1",
      totalAmount: 850,
      taxable: 809.52,
      tax: 40.48, 
      date: "2025-11-25",
      category: "Food & Beverages"
    };
  } 
  // --- DEFAULT (Normal Invoice) ---
  else {
    data = {
      supplier: "ABC Traders",
      gstin: "29ABCDE1234F1Z5",
      totalAmount: 5900,
      taxable: 5000,
      tax: 900,
      date: new Date().toISOString().slice(0, 10),
      category: "General Goods"
    };
  }

  return {
    invoiceNumber: "INV-" + Math.floor(Math.random() * 9000),
    date: data.date,
    supplier: data.supplier,
    supplierGSTIN: data.gstin,
    
    // For Frontend Table
    totalAmount: data.totalAmount, 
    
    // For Tax Service calculations
    taxableValue: data.taxable,
    gstRate: 18,
    cgst: data.tax / 2,
    sgst: data.tax / 2,
    igst: 0,
    category: data.category
  };
};