// src/services/ocrParser.js

export const parseInvoiceFields = (text) => {
    const res = {};
    if (!text) return res;

    // Helper: Clean money values
    const parseMoney = (str) => {
        if (!str) return null;
        const clean = str.replace(/[^0-9.]/g, ""); 
        const val = parseFloat(clean);
        return isNaN(val) ? null : val;
    };

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const full = lines.join(" | ");

    // 1. GSTIN (Working perfectly now)
    const gstinLabelMatch = full.match(/GSTIN\s*[:.\-]?\s*([0-9A-Z\-\s]{15,20})/i);
    if (gstinLabelMatch) {
        res.gstin = gstinLabelMatch[1].replace(/[\-\s]/g, "").substring(0, 15);
    } else {
        const looseMatch = full.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[A-Z\d]{1}[A-Z\d]{1}\b/);
        if (looseMatch) res.gstin = looseMatch[0];
    }

    // 2. Invoice Number
    const invMatch = full.match(/(?:Invoice\s*No|Inv\s*No\.?|Bill\s*No)\.?\s*[:|\-]?\s*([A-Z0-9\-/]+)/i);
    if (invMatch) res.invoiceNumber = invMatch[1].replace(/\|/g, "").trim();

    // 3. Date
    const dateMatch = full.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})\b/);
    if (dateMatch) res.date = dateMatch[0];

    // ----------------------------------------
    // 4. Supplier (FIXED: Aggressive Filtering)
    // ----------------------------------------
    // We explicitly ban words that look like template placeholders
    const noiseWords = [
        "TAX INVOICE", "INVOICE", "ORIGINAL", "COPY", 
        "INSERT", "LOGO", "HERE", "DATE", "PAGE", 
        "WWW.", ".COM", ".IN", "HTTP" // Ignore websites
    ];
    
    // Find the first line that is NOT a noise word
    const cleanLines = lines.filter(line => {
        const upper = line.toUpperCase();
        // Return FALSE if the line contains any noise word
        const isNoise = noiseWords.some(noise => upper.includes(noise));
        // Also skip purely numeric lines or very short lines
        const isNumeric = /^[0-9\s\-\.\,]+$/.test(line);
        
        return !isNoise && !isNumeric && line.length > 3;
    });

    // The first valid line remaining is usually the Supplier Name
    res.supplier = cleanLines.length ? cleanLines[0] : "Unknown Supplier";

    // 5. AMOUNTS (Working perfectly)
    const moneyRegex = /[₹$€\s]*[*]*([0-9,]+\.[0-9]{2})\b/g;
    let allMoney = [];
    let m;
    while ((m = moneyRegex.exec(full)) !== null) {
        const val = parseMoney(m[1]);
        if (val && val > 0) allMoney.push(val);
    }

    allMoney = [...new Set(allMoney)];
    allMoney.sort((a, b) => b - a);

    if (allMoney.length > 0) {
        res.total = allMoney[0];
        for (let i = 1; i < allMoney.length; i++) {
            const candidate = allMoney[i];
            const diff = res.total - candidate;
            if (diff > 5) {
                res.taxableValue = candidate;
                break;
            }
        }
    }

    return res;
};