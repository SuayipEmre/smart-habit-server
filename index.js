import dotenv from "dotenv";
dotenv.config({ path: './.env' });


import express from 'express'
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from './src/db/connectdb.js';
import { JWT_EXPIRES_IN, JWT_SECRET, PORT } from "./src/config/env.js";


import authRoutes from './src/routes/auth.route.js';
import habitRoutes from './src/routes/habit.route.js';

const app = express();


connectDB()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())

import "./src/cron/reminder.cron.js";


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/habit', habitRoutes);


app.listen(PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
})