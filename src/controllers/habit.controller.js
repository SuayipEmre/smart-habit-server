import Habit from "../models/habit.model.js";
import { sendResponse } from "../utils/sendResponse.js";

export const createHabit = async (req, res, next) => {
    try {

        const user = req.user
        const {
            title,
            description,
            frequency,
            reminderTime,
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
            reminderTime,
            user: user._id,
        }).save();


        sendResponse(res, 201, 'Habit created successfully', {
            habit: newHabit,
        })

    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
}

export const getHabits = async (req, res, next) => {
    try {
        const user = req.user
        const habits = await Habit.find({ user: user._id })
            .sort({ createdAt: -1, updatedAt: -1 })
        sendResponse(res, 200, 'Habits fetched successfully', { habits });
    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
}

export const updateHabits = async (req, res, next) => {
    try {
        const user = req.user
        const { habitId } = req.params;
        const { title, description, frequency, reminderTime, } = req.body;

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

        console.log('REMINDER TIME FROM CLIENT SIDE : ', reminderTime);
        habit.title = title || habit.title;
        habit.description = description || habit.description;
        habit.frequency = frequency || habit.frequency;
        habit.reminderTime = reminderTime || habit.reminderTime;

        await habit.save();
        sendResponse(res, 200, 'Habit updated successfully', {
            habit,
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

        sendResponse(res, 200, 'Habit deleted successfully');
    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
}

export const completeHabit = async (req, res, next) => {
    try {
        const user = req.user;
        const { habitId } = req.params;

        if (!habitId) {
            const error = new Error("Habit ID is required");
            error.status = 400;
            return next(error);
        }

        const habit = await Habit.findOne({ _id: habitId, user: user._id });
        if (!habit) {
            const error = new Error("Habit not found or unauthorized");
            error.status = 404;
            return next(error);
        }

        const normalizeUTC = (date) =>
            new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

        const today = normalizeUTC(new Date());

        const lastDateRaw = habit.completedDates.at(-1);
        const lastDate = lastDateRaw ? normalizeUTC(new Date(lastDateRaw)) : null;

        if (lastDate && lastDate.getTime() === today.getTime()) {
            const error = new Error("Habit already completed for today");
            error.status = 400;
            return next(error);
        }

        habit.isCompletedToday = true;

        habit.completedDates.push(today);

        let diffDays = 0;
        if (lastDate) {
            diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));
        }

        if (habit.frequency === "daily") {
            habit.streak = diffDays === 1 ? habit.streak + 1 : 1;
        } else if (habit.frequency === "weekly") {
            habit.streak = diffDays >= 1 && diffDays <= 7 ? habit.streak + 1 : 1;
        } else if (habit.frequency === "monthly") {
            habit.streak = diffDays >= 1 && diffDays <= 31 ? habit.streak + 1 : 1;
        } else {
            habit.streak = 1;
        }

        await habit.save();

        sendResponse(res, 200, "Habit marked as complete for today", { habit });
    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
};

export const getTodayHabits = async (req, res, next) => {
    try {
        const user = req.user;

        // 🗓️ Bugünün UTC başlangıcı ve yarının UTC başlangıcı
        const now = new Date();
        const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const tomorrowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

        // 🔍 Sorgu: sadece daily ve bugün tamamlanmamış alışkanlıklar
        const todayHabits = await Habit.find({
            user: user._id,
            frequency: "daily",
            $or: [
                { completedDates: { $exists: false } }, // hiç yapılmamış
                { completedDates: { $size: 0 } },       // boş liste
                {
                    completedDates: {
                        $not: {
                            $elemMatch: {
                                $gte: todayStart,
                                $lt: tomorrowStart,
                            },
                        },
                    },
                },
            ],
        })
            .select("title frequency streak completedDates description isCompletedToday")
            .lean(); // Mongoose doküman objesi yerine sade JS objesi döner → performanslı


        sendResponse(res, 200, "Today's habits fetched successfully", { habits: todayHabits });

    } catch (error) {
        error.status = error.status || 500;
        next(error);
    }
};
