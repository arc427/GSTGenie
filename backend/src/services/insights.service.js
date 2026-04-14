// Generate simple rule-based insights for the invoice
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config"; // Ensure API key is loaded

export const generateRuleInsights = (invoice) => {
    const insights = [];
  
    const gst = invoice.gst || {};
    const tds = invoice.tds || {};
    const tcs = invoice.tcs || {};
    const pt = invoice.pt || {};
  
    if (gst.cgst + gst.sgst > 800) {
      insights.push({
        type: "info",
        message: "High GST detected — consider checking ITC eligibility."
      });
    }
  
    if (tds && tds.tds > 0) {
      insights.push({
        type: "warning",
        message: `TDS of ₹${tds.tds} applicable on this invoice.`
      });
    }
  
    if (tcs && tcs.tcs > 0 && tcs.applicable) {
      insights.push({
        type: "info",
        message: `TCS of ₹${tcs.tcs} collected; ensure reporting in 27EQ.`
      });
    }
  
    insights.push({
      type: "deadline",
      message: "GSTR-1 due in 5 days — review outward supplies."
    });
  
    return insights;
  };
  
  // ===== GEMINI AI INSIGHTS (new) =====
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  export const generateGeminiInsights = async (invoice) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
    const prompt = `
  You are an Indian GST and tax assistant.
  Given the invoice data below, generate actionable compliance insights.
  
  Data: ${JSON.stringify(invoice)}
  
  Respond STRICTLY in JSON array with this format:
  [
    { "type": "summary", "message": "..." },
    { "type": "risk", "message": "..." },
    { "type": "action", "message": "..." },
    { "type": "due-date", "message": "..." }
  ]
  If any category does not apply, still include it with an empty message.
  `;
  
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log("🤖 Raw AI Response:", responseText); // Debugging log

    // ✅ FIX: Clean markdown (```json ... ```) before parsing
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      const aiInsights = JSON.parse(cleanJson);
      return aiInsights;
    } catch (error) {
      console.error("AI Error:", error);
      return [];
    }
  };
  
  // ✅ 3) FINAL COMBINED EXPORT — RULE-BASED + GEMINI
  export const generateInsights = async (invoice) => {
    const ruleBased = generateRuleInsights(invoice);
    const aiBased = await generateGeminiInsights(invoice);
    return [...ruleBased, ...aiBased];
  };
  