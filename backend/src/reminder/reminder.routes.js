// src/reminder/reminder.routes.js
import express from "express";
import * as ReminderController from "./reminder.controller.js";

const router = express.Router();

router.post("/", ReminderController.createReminder);
router.get("/", ReminderController.getReminders);
router.delete("/:id", ReminderController.deleteReminder);

export default router;
