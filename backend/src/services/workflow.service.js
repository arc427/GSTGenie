// src/services/workflow.service.js

export const runAgentWorkflow = (ocrData) => {
    const logs = []; 
    const insights = [];
    let riskScore = 0;
    let status = "Processing";
  
    logs.push("🤖 Agent: Initiating Full Compliance & Opportunity Scan...");
  
    const total = parseFloat(ocrData.total || 0);
    const taxable = parseFloat(ocrData.taxableValue || 0);
    const gstAmount = total > taxable ? total - taxable : 0;
    const supplier = ocrData.supplier || "Unknown Supplier";
    const gstin = ocrData.gstin;
    const invoiceDate = ocrData.date;
  
    // ====================================================
    // 1. CORE COMPLIANCE CHECKS (The "Agentic" Part)
    // ====================================================
  
    // Check A: GSTIN Validity
    if (!gstin || gstin.length < 15) {
      riskScore += 50;
      logs.push("❌ Agent: CRITICAL - GSTIN is missing or invalid.");
      insights.push({
        type: "risk",
        title: "Missing or Invalid GSTIN",
        description: "Supplier GSTIN is missing. This invoice cannot be used for ITC claims.",
        priority: "high"
      });
    } else {
      logs.push(`✅ Agent: Valid GSTIN format detected (${gstin}).`);
      // Add the "Verify" action (from your old code)
      insights.push({
        type: "action",
        title: "Verify Vendor Status",
        description: `GSTIN ${gstin} detected. Validate active status on GST Portal before payment.`,
        priority: "low"
      });
    }
  
    // Check B: Math & Tax Rate Logic
    if (total > 0 && taxable > 0) {
      const calculatedRate = (gstAmount / taxable) * 100;
      
      // Standard slabs: 5%, 12%, 18%, 28% (allow 1% variance)
      const isStandard = [5, 12, 18, 28].some(rate => Math.abs(rate - calculatedRate) < 1.5);
  
      if (!isStandard && calculatedRate > 1) {
        riskScore += 30;
        logs.push(`⚠️ Agent: Non-standard Tax Rate detected (~${calculatedRate.toFixed(1)}%).`);
        insights.push({
          type: "action", // Changed to Action (Blue) instead of Risk
          title: "Verify Tax Rate",
          description: `Calculated tax is ${calculatedRate.toFixed(1)}%, which is not a standard slab (5/12/18/28%). Verification recommended.`,
          priority: "medium"
        });
      } else {
        logs.push("✅ Agent: Tax math is consistent.");
      }
    }
  
    // ====================================================
    // 2. STANDARD OPPORTUNITY INSIGHTS (The "Old" Part)
    // ====================================================
  
    // Check C: ITC Availability
    if (gstAmount > 0) {
      logs.push(`💰 Agent: ITC Opportunity found: ₹${gstAmount.toFixed(2)}`);
      insights.push({
        type: "summary", // Green Summary style
        title: "Potential ITC Available",
        description: `Detected ₹${gstAmount.toFixed(2)} in tax. Ensure vendor files GSTR-1 to claim this credit.`,
        priority: "medium"
      });
    }
  
    // Check D: Due Date
    if (invoiceDate) {
      logs.push(`📅 Agent: Invoice date is ${invoiceDate}`);
      insights.push({
        type: "deadline", // Yellow Deadline style
        title: "Filing Due Date",
        description: `Based on invoice date ${invoiceDate}, claim this in next month's GSTR-3B (by 20th).`,
        priority: "medium"
      });
    }
  
    // ====================================================
    // 3. FINAL DECISION
    // ====================================================
    if (riskScore >= 50) {
      status = "Action Required";
      logs.push("🛑 Agent Decision: High Risk.");
    } else if (riskScore > 0) {
      status = "Review Needed";
      logs.push("⚠️ Agent Decision: Review Needed.");
    } else {
      status = "Auto-Approved";
      logs.push("🚀 Agent Decision: CLEAN.");
      
      // Add a general success card if everything is perfect
      insights.unshift({
        type: "summary",
        title: "Invoice Auto-Approved",
        description: `Processed invoice from ${supplier}. All compliance checks passed.`,
        priority: "low"
      });
    }
  
    return {
      status,
      riskScore,
      logs,
      insights
    };
  };