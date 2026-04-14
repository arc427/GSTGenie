export const calculateGST = (ocrData) => {
  const taxableValue = Number(ocrData.taxableValue || 0);
  const gstRate = 0.18; // Default 18%

  // If OCR provided breakdown, use it
  if (ocrData.cgst && ocrData.sgst) {
    return {
      amount: Number(ocrData.cgst) + Number(ocrData.sgst),
      details: { cgst: ocrData.cgst, sgst: ocrData.sgst }
    };
  }

  const tax = +(taxableValue * gstRate).toFixed(2);
  return { amount: tax, details: { cgst: tax/2, sgst: tax/2 } };
};

export const calculateTDS = (ocrData) => {
  const amount = Number(ocrData.taxableValue || ocrData.totalAmount || 0);
  const category = (ocrData.category || "").toLowerCase();

  // RULE: Section 194J - Professional Services (Tech/Legal) > 30k
  if (category.includes("service") || category.includes("tech") || category.includes("legal")) {
    if (amount > 30000) {
      return {
        amount: +(amount * 0.10).toFixed(2),
        rate: "10% (194J)",
        applicable: true
      };
    }
  }
  // RULE: Section 194C - Contractors > 1L
  if (category.includes("contract") || category.includes("repair")) {
     if (amount > 100000) {
      return {
        amount: +(amount * 0.01).toFixed(2),
        rate: "1% (194C)",
        applicable: true
      };
     }
  }

  return { amount: 0, rate: "0%", applicable: false };
};

export const calculateTCS = (ocrData) => {
  const amount = Number(ocrData.totalAmount || 0);
  const category = (ocrData.category || "").toLowerCase();

  // RULE: Section 206C - Scrap / E-commerce
  if (category.includes("scrap") || category.includes("commerce") || category.includes("swiggy")) {
    return {
      amount: +(amount * 0.01).toFixed(2),
      rate: "1% (206C)",
      applicable: true
    };
  }

  return { amount: 0, rate: "0%", applicable: false };
};

export const calculateProfessionalTax = () => ({ amount: 0, applicable: false });