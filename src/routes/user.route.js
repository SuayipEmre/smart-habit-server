import express from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { updateExpoPushToken } from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.post('/update-expo-push-token', authorize, updateExpoPushToken )


export default userRoute;