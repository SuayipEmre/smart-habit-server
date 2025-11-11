import cron from "node-cron";
import User from "../models/user.model.js";
import { sendPushNotification } from "../utils/sendPushNotification.js";

/**
 * Sends a daily reminder at 12:00 PM (Istanbul time).
 * Notes:
 * - Only users with an expoPushToken will receive the notification.
 */
cron.schedule(
  "0 12 * * *",
  async () => {
    try {
      console.log("🕛 [NoonReminder] Running...");

      const users = await User.find({
        expoPushToken: { $exists: true, $ne: null },
      }).select("expoPushToken");

      if (!users.length) {
        console.log("ℹ️ [NoonReminder] No users with expoPushToken found.");
        return;
      }

      // Simple sequential sending — ideal for small to medium user bases.
      for (const { expoPushToken } of users) {
        await sendPushNotification(
          expoPushToken,
          "SmartHabit ⏰",
          "It’s noon! Don't forget to complete your habits for today."
        );
      }

      console.log(`✅ [NoonReminder] Sent notifications to ${users.length} user(s).`);
    } catch (err) {
      console.error("❌ [NoonReminder] Failed:", err?.message || err);
    }
  },
  {
    timezone: "Europe/Istanbul",
  }
);
