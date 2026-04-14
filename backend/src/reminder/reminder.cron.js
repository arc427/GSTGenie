import cron from "node-cron";
import ReminderService from "./reminder.service.js";
import moment from "moment";

console.log("🔄 Reminder cron loaded");

// Run every minute
cron.schedule("* * * * *", () => {
  const now = moment();

  console.log("⏳ Cron running at:", now.format());

  const reminders = ReminderService.getAllReminders();

  reminders.forEach((reminder) => {
    const reminderTime = moment(reminder.time, "YYYY-MM-DD HH:mm");

    if (
      reminder.status === "pending" &&
      now.isSameOrAfter(reminderTime)
    ) {
      console.log("⏰ REMINDER TRIGGERED:", reminder.title);

      reminder.status = "triggered";
    }
  });
});
