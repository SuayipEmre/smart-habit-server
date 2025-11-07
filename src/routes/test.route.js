import User from "../models/user.model.js";
import { sendPushNotification } from "../utils/sendPushNotification.js";
import express from "express";

const testRouter = express.Router();
testRouter.get("/notif", async (req, res) => {


  const user = await User.findOne({ expoPushToken: { $exists: true } });

  if (!user) {
    return res.status(400).json({
      message: "No user with expoPushToken. Mobile token göndermemiş.",
    });
  }

  await sendPushNotification(
    user.expoPushToken,
    "SmartHabit ✅",
    `Merhaba ${user.name} Push notification is working!`
  );

  res.json({ message: "Test notification sent ✅" });
});


export default testRouter;