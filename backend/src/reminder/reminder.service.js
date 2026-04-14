// src/reminder/reminder.service.js

class ReminderService {
    constructor() {
      this.reminders = [];
    }
  
    createReminder(data) {
      const reminder = {
        id: Date.now(),
        title: data.title,
        time: data.time,
        status: "pending"
      };
      this.reminders.push(reminder);
      return reminder;
    }
  
    getAllReminders() {
      return this.reminders;
    }
  
    deleteReminder(id) {
      const index = this.reminders.findIndex(r => r.id == id);
      if (index === -1) return false;
      this.reminders.splice(index, 1);
      return true;
    }
  }
  
  export default new ReminderService();
  