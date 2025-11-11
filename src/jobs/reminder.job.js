import cron from "node-cron";
import { sendEmail } from "../utils/email.js";
import Habit from "../models/habit.model.js";

cron.schedule("* * * * *", async () => {
  // Her 5 dakikada bir kontrol (test için)
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const habits = await Habit.find({ reminderTime: { $exists: true, $ne: null } })
  .populate("user", "email username");

  for (const habit of habits) {
    if (!habit.reminderTime) continue;

    const [hour, minute] = habit.reminderTime.split(":").map(Number);
    const today = now.toISOString().split("T")[0];
    const completedToday = habit.completedDates.some(
      (d) => d.toISOString().split("T")[0] === today
    );

    if (!completedToday && hour === currentHour && minute === currentMinute) {
        await sendEmail(
            habit.user.email,
            "Habit Reminder",
            habit.title,
            habit.user.username
          );
      console.log(`Reminder sent to ${habit.user.email}`);
    }
  }
});
