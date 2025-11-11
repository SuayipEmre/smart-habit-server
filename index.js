import dotenv from "dotenv";
dotenv.config({ path: './.env' });


import express from 'express'
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from './src/db/connectdb.js';
import { PORT } from "./src/config/env.js";


import authRoutes from './src/routes/auth.route.js';
import habitRoutes from './src/routes/habit.route.js';
import statsRouter from "./src/routes/stats.route.js";
import testRouter from "./src/routes/test.route.js";
import userRoute from "./src/routes/user.route.js";


import "./src/jobs/reminder.job.js";
import "./src/jobs/resetHabits.js";
import "./src/jobs/dailyReminder.job.js";

import errorMiddleware from "./src/middlewares/error.middleware.js";
import arcjetMiddleware from "./src/middlewares/arcjet.middleware.js";


const app = express();


connectDB()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())
app.use(arcjetMiddleware) 


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/habit', habitRoutes);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/tests', testRouter);
app.use('/api/v1/user', userRoute);

app.get('/', (req, res) => {
  res.status(200).json({
    status : 'success',
    message : 'SmartHabit API is running 🚀'
  })
})


// Error Middleware
app.use(errorMiddleware)

app.listen(PORT || 5000, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT || 5000}`);
})