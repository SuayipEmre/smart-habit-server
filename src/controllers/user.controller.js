import User from "../models/user.model.js";
import { sendResponse } from "../utils/sendResponse.js";

export const updateExpoPushToken = async (req, res, next) => {
    try {
      const { token } = req.body;
  
      if (!token) {
        const error = new Error("Expo push token is required");
        error.status = 400;
        return next(error);
      }
  
      await User.findByIdAndUpdate(req.user._id, { expoPushToken: token });
  
     sendResponse(res, 200, "Expo push token updated successfully");
    } catch (error) {
      next(error);
    }
  };