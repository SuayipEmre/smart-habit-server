import dotenv from "dotenv";
dotenv.config({ path: './.env' });


import express from 'express'
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from './src/db/connectdb.js';
import { PORT } from "./src/config/env.js";




const app = express();

console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())


app.listen(PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
})