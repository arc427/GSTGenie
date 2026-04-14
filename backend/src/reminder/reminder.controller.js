// src/reminder/reminder.controller.js
import ReminderService from "./reminder.service.js";

export const createReminder = (req, res) => {
  const reminder = ReminderService.createReminder(req.body);
  res.status(201).json(reminder);
};

export const getReminders = (req, res) => {
  res.json(ReminderService.getAllReminders());
};

export const deleteReminder = (req, res) => {
  const success = ReminderService.deleteReminder(req.params.id);
  if (!success) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  res.json({ message: "Reminder deleted" });
};
