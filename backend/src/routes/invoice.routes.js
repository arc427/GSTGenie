// src/routes/invoice.routes.js
import express from "express";
import upload from "../middleware/upload.js"; 
import {
  getAllInvoices,
  getInvoiceById,
  uploadInvoice, 
} from "../controllers/invoice.controller.js";

const router = express.Router();

// GET /api/invoices
router.get("/", getAllInvoices);

// GET /api/invoices/:id
router.get("/:id", getInvoiceById);

// POST /api/invoices/upload
router.post("/upload", upload.single("file"), uploadInvoice);

// 👇 THIS LINE IS CRITICAL. DO NOT FORGET IT!
export default router;