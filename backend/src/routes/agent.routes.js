// src/routes/agent.routes.js
import express from "express";
import upload from "../middleware/upload.js"; // Ensure this path is correct
import { visionUpload } from "../controllers/agent.controller.js";

const router = express.Router();

// POST /api/agent/vision-upload
router.post("/vision-upload", upload.single("file"), visionUpload);

router.get("/ping", (req, res) => {
  res.json({ message: "agent routes working!" });
});

export default router;