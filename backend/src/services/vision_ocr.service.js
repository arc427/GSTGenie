import vision from "@google-cloud/vision";
import fs from "fs";
import dotenv from "dotenv";
import { parseInvoiceFields } from "./ocrParser.js";

dotenv.config();

// ✅ RESTORED: Explicitly point to the key file to ensure connection works
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const extractWithVision = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at path: " + filePath);
    }

    console.log("🔍 Vision Service: Sending image to Google Cloud...", filePath);

    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;
    const fullText = (detections && detections.length) ? detections[0].description : "";

    if (!fullText) {
        console.warn("⚠️ Vision Service: Google returned empty text.");
        return { rawText: "", parsed: {} };
    }

    // Parse the text
    const parsed = parseInvoiceFields(fullText);
    console.log("✅ Vision Parsed Data:", parsed); // Debug log

    return { rawText: fullText, parsed };

  } catch (error) {
    console.error("❌ Vision Service Error:", error.message);
    throw error;
  }
};