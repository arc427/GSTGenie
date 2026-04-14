// src/controllers/agent.controller.js
import { extractWithVision } from "../services/vision_ocr.service.js";
import { runAgentWorkflow } from "../services/workflow.service.js"; // 👈 Import the Brain
import { invoicesDB } from "../utils/store.js"; 

export const visionUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    console.log("🚀 Agent: Reading file...", filePath);

    // 1. PERCEPTION (OCR)
    const { rawText, parsed } = await extractWithVision(filePath);

    // 2. REASONING (The Agentic Workflow)
    // We pass the raw data to the brain
    const agentResult = runAgentWorkflow(parsed);

    // Calculate GST for display
    const calculatedGst = (parsed.total && parsed.taxableValue) 
      ? (parsed.total - parsed.taxableValue).toFixed(2) 
      : 0;

    // 3. ACTION (Save State)
    const newInvoice = {
      id: Date.now(),
      filePath: filePath,
      
      // Data
      date: parsed.date || new Date().toLocaleDateString("en-IN"),
      supplier: parsed.supplier || "Unknown Supplier",
      gstin: parsed.gstin || "-",
      totalAmount: parsed.total || 0,
      gstAmount: calculatedGst,
      
      // ✅ Save the Agent's decisions
      status: agentResult.status, 
      riskScore: agentResult.riskScore,
      insights: agentResult.insights,
      agentLogs: agentResult.logs
    };

    invoicesDB.unshift(newInvoice); 
    
    console.log("\n--- 🤖 AGENT LOGS ---");
    agentResult.logs.forEach(l => console.log(l));
    console.log("---------------------\n");

    return res.status(200).json({
      message: "Agentic Workflow Completed",
      data: { 
        parsed,
        workflow: agentResult // Send thoughts back to UI
      }
    });

  } catch (err) {
    console.error("visionUpload error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};