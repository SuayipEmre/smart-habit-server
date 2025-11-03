import express from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getProgressStats, getStreakStats } from '../controllers/stats.controller.js';


const statsRouter = express.Router();

statsRouter.get('/streak', authorize, getStreakStats )
statsRouter.get('/progress', authorize, getProgressStats);


export default statsRouter