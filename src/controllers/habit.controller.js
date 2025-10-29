import Habit from "../models/habit.model.js";

export const createHabit = async (req, res, next) => {
    try {

        const user = req.user
        const {
            title,
            description,
            frequency,
        } = req.body;


        if (!title || !frequency) {
            const error = new Error('Title and frequency are required');
            error.status = 400;
            return next(error);
        }

        const newHabit = await new Habit({
            title,
            description,
            frequency,
            user: user._id,
        }).save();

        res.status(201).json({
            status: 'success',
            message: 'Habit created successfully',
            data: {
                habit: newHabit,
            }
        })
        next()
    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
}

export const getHabits = async (req, res, next) => {
    try {
        const user = req.user

        const habits = await Habit.find({ user: user._id });

        res.status(200).json({
            status: 'success',
            message: 'Habits fetched successfully',
            data: {
                habits,
            }
        })
        next()
    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
}
export const updateHabits = async (req, res, next) => {
    try {
        const user = req.user
        const { habitId } = req.params;
        const { title, description, frequency } = req.body;

        if (!habitId) {
            const error = new Error('Habit ID is required');
            error.status = 400;
            return next(error);
        }

        const habit = await Habit.findOne({ _id: habitId, user: user._id });

        if (!habit) {
            const error = new Error('Habit not found or unauthorized');
            error.status = 404;
            return next(error);
        }

        habit.title = title || habit.title;
        habit.description = description || habit.description;
        habit.frequency = frequency || habit.frequency;
        await habit.save();
        res.status(200).json({
            status: 'success',
            message: 'Habit updated successfully',
            data: {
                habit,
            }
        })
    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
}

export const deleteHabits = async (req, res, next) => {
    try {
        const user = req.user
        const { habitId } = req.params;

        if (!habitId) {
            const error = new Error('Habit ID is required');
            error.status = 400;
            return next(error);
        }

        const habit = await Habit.findOneAndDelete({ _id: habitId, user: user._id });

        if (!habit) {
            const error = new Error('Habit not found or unauthorized');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            message: 'Habit deleted successfully',
        })
    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
}

export const completeHabit = async(req, res, next) => {
  try {
    const user = req.user;
    const{ habitId } = req.params;

    if(!habitId) {
        const error = new Error('Habit ID is required');
        error.status = 400;
        return next(error);
    }

    const habit = await Habit.findOne({_id : habitId, user:user._id});

    if(!habit) {
        const error = new Error('Habit not found or unauthorized');
        error.status = 404;
        return next(error);
    }
    const today = new Date();
    const lastDate = habit.completedDates.at(-1);

    if(lastDate && lastDate.toDateString() === today.toDateString()) {
        const error = new Error('Habit already completed for today');
        error.status = 400;
        return next(error);
    }

    habit.completedDates.push(today);

    // Update streak

    let diffDays = 0;
    if (lastDate) {
      const diffTime = today - lastDate;
      diffDays = diffTime / (1000 * 60 * 60 * 24);
    }

    if (habit.frequency === "daily") {
      if (diffDays === 1) habit.streak += 1;
      else habit.streak = 1;
    } else if (habit.frequency === "weekly") {
      if (diffDays >= 1 && diffDays <= 7) habit.streak += 1;
      else habit.streak = 1;
    } else if (habit.frequency === "monthly") {
      if (diffDays >= 1 && diffDays <= 31) habit.streak += 1;
      else habit.streak = 1;
    } else {
      habit.streak = 1;
    }

    await habit.save()

    res.status(200).json({
      status: "success",
      message: "Habit marked as complete for today",
      data: {
        habit,
      },
    });

    next()

  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
}