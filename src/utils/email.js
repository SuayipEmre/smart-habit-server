
import nodemailer from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USER } from "../config/env.js";


export const sendEmail = async (to, subject, habitTitle, username) => {
  try {
    // 1️⃣ Transporter oluştur
    const transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    // 2️⃣ HTML şablon
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #4f46e5; text-align: center;">🕒 SmartHabit Reminder</h2>
          <p style="font-size: 16px; color: #333;">
            Hey <strong>${username}</strong> 👋,
          </p>
          <p style="font-size: 15px; color: #555;">
            Just a quick reminder to complete your habit:
          </p>
          <div style="background: #f3f4f6; padding: 12px; border-left: 4px solid #4f46e5; margin: 15px 0; border-radius: 5px;">
            <strong>${habitTitle}</strong>
          </div>
          <p style="font-size: 14px; color: #666;">Stay consistent — you're building something great! 💪</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} SmartHabit. All rights reserved.
          </p>

          <p style="font-size: 12px; color: 'blue'; text-align: center;">
        </p>
        </div>
      </div>
    `;

    // 3️⃣ Mail ayarları
    const mailOptions = {
      from: `"SmartHabit" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    // 4️⃣ Gönder
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};
