import authorize from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";
import { sendPushNotification } from "../utils/sendPushNotification.js";
import express from "express";

const testRouter = express.Router();
testRouter.get("/notif", authorize, async (req, res) => {

    const { message } = req.query

    const {_id} = req.user

    const user = await User.findOne({_id, expoPushToken: { $exists: true } });

    console.log("user", user);
    if (!user) {
        return res.status(400).json({
            message: "No user with expoPushToken. Mobile token göndermemiş.",
        });
    }

    await sendPushNotification(
        user.expoPushToken,
        "SmartHabit ✅",
        `Merhaba ${user.name} ${message || "bu bir test bildirimidir."}`
    );

    res.json({ message: "Test notification sent ✅" });
});


export default testRouter;