import Habit from "../models/habit.model.js";
import { sendResponse } from "../utils/sendResponse.js";

export const getStreakStats = async (req, res, next) => {
  try {
    const user = req.user

    const usersHabits = await Habit.find({ user: user._id }).sort({ streak: -1 }).limit(1);

    if (usersHabits.length > 0) {

      sendResponse(res, 200, 'Streak stats fetched successfully', {
        bestStreak: usersHabits[0].streak,
        bestHabit: usersHabits[0].title,
        completedDatesCount: usersHabits.reduce((acc, habit) => acc + habit.completedDates.length, 0),
      })
    } else {
      return res.status(200).json({
        success: true,
        message: 'No available habits for streak stats',
      })
    }

  } catch (error) {
    console.log('Error in getStreakStats:', error);
    next(error);
  }
}

export const getProgressStats = async (req, res, next) => {
  try {
    const user = req.user; 
    const range = parseInt(req.query.range) || 7;

    const habits = await Habit.find({ user: user._id });

    if (!habits.length) {
      sendResponse(res, 200, 'No habits found for this user', {
        progress: []
      })
    }

    const today = new Date();
    const progress = [];

    for (let i = range - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // UTC string

      let completedCount = 0;

      habits.forEach((habit) => {
        const hasCompleted = habit.completedDates.some(
          (d) => d.toISOString().split('T')[0] === dateStr
        );
        if (hasCompleted) completedCount++;
      });

      progress.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
      });
    }

    sendResponse(res, 200, 'Progress stats fetched successfully', {
      progress
    })
  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
};
