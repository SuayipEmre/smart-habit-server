import cron from "node-cron";
import Habit from "../models/habit.model.js";

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🕛 Resetting daily habits...");

    await Habit.updateMany(
      { isCompletedToday: true },
      { $set: { isCompletedToday: false } }
    );

    console.log("✅ All daily habits reset successfully.");
  } catch (error) {
    console.error("❌ Habit reset job failed:", error.message);
  }
});
