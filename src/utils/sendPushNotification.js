import axios from "axios";

export async function sendPushNotification(expoPushToken, title, body) {
  try {
    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      priority: "high",
    };

    await axios.post("https://exp.host/--/api/v2/push/send", message);

    console.log(" Notification sent via Expo ");
  } catch (error) {
    console.log("Expo Push Error:", error.response?.data || error.message);
  }
}
