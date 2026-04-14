import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import invoiceRoutes from "./routes/invoice.routes.js";
import agentRoutes from "./routes/agent.routes.js";

// 👇 FIX: Use 'import' instead of 'require'
import reminderRoutes from "./reminder/reminder.routes.js"; 
import "./reminder/reminder.cron.js"; // This starts the cron job

const app = express();

// Middleware
app.use(cors({ origin: "*" })); 
app.use(express.json());

// Serve Static Files (Uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Assuming uploads is one level up in the root backend folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/reminder", reminderRoutes);

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/api/agent-test", (req, res) => res.json({ message: "DIRECT test works" }));

export default app;