import e from "express";
import authorize from "../middlewares/auth.middleware.js";
import { completeHabit, createHabit, deleteHabits, getHabits, updateHabits } from "../controllers/habit.controller.js";

const habitRouter = e.Router();


habitRouter.get('/', authorize, getHabits)
habitRouter.post('/create', authorize, createHabit)
habitRouter.post('/complete/:habitId', authorize, completeHabit)
habitRouter.delete('/delete/:habitId', authorize, deleteHabits)
habitRouter.put('/update/:habitId', authorize, updateHabits)


export default habitRouter