import Habit from "../models/habit.model.js";

export const getStreakStats = async(req, res, next) => {
  try {
    const user = req.user

    const usersHabits = await Habit.find({ user: user._id }).sort({ streak: -1 }).limit(1);

    if(usersHabits.length > 0){
        return res.status(200).json({
            success: true,
            message : 'Streak stats fetched successfully',
              data: {
                  bestStreak: usersHabits[0].streak ,
                  bestHabit:  usersHabits[0].title,
                  completedDatesCount: usersHabits.reduce((acc, habit) => acc + habit.completedDates.length, 0),
              },
          });
    }else{
    return res.status(200).json({
        success: true,
        message : 'No available habits for streak stats',
    })
    }
  
  } catch (error) {
    console.log('Error in getStreakStats:', error);
    next(error);
  }
}