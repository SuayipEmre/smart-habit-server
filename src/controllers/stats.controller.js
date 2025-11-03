import Habit from "../models/habit.model.js";

export const getStreakStats = async (req, res, next) => {
  try {
    const user = req.user

    const usersHabits = await Habit.find({ user: user._id }).sort({ streak: -1 }).limit(1);

    if (usersHabits.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Streak stats fetched successfully',
        data: {
          bestStreak: usersHabits[0].streak,
          bestHabit: usersHabits[0].title,
          completedDatesCount: usersHabits.reduce((acc, habit) => acc + habit.completedDates.length, 0),
        },
      });
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
    const user = req.user; // giriş yapan kullanıcıyı al
    const range = parseInt(req.query.range) || 7; // ?range=7 (varsayılan 7 gün)

    // 1️⃣ Kullanıcının tüm habit’lerini çek
    const habits = await Habit.find({ user: user._id });

    // Eğer hiç habit yoksa
    if (!habits.length) {
      return res.status(200).json({
        status: 'success',
        data: { progress: [] },
        message: 'No habits found for this user'
      });
    }

    // 2️⃣ Bugünden geriye range kadar gün oluştur
    const today = new Date();
    const progress = [];

    for (let i = range - 1; i >= 0; i--) {
      // i gün önceki tarihi bul
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // UTC string

      // 3️⃣ O gün kaç habit tamamlanmış?
      let completedCount = 0;

      habits.forEach((habit) => {
        const hasCompleted = habit.completedDates.some(
          (d) => d.toISOString().split('T')[0] === dateStr
        );
        if (hasCompleted) completedCount++;
      });

      // 4️⃣ Sonuca ekle
      progress.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedCount,
      });
    }

    // 5️⃣ Sonucu döndür
    res.status(200).json({
      status: 'success',
      data: { progress },
    });
  } catch (error) {
    error.status = error.status || 500;
    next(error);
  }
};
