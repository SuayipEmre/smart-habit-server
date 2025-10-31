import express from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { getStreakStats } from '../controllers/stats.controller.js';

const statsRouter = express.Router();

statsRouter.get('/streak', authorize, getStreakStats )


export default statsRouter