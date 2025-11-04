import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Habit title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 300 characters"],
    },
    frequency: {
      type: String,
      enum: {
        values: ["daily", "weekly", "monthly"],
        message: "Frequency must be one of: daily, weekly, or monthly",
      },
      required: [true, "Habit frequency is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    streak: {
      type: Number,
      default: 0,
      min: [0, "Streak cannot be negative"],
    },
    completedDates: [
      {
        type: Date,
        validate: {
          validator: function (date) {
        
            return date <= new Date();
          },
          message: "Completed date cannot be in the future",
        },
      },
    ],
    reminderTime: {
      type: String, 
      validate: {
        validator: function (value) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
        },
        message: "Reminder time must be in HH:MM format (24-hour)",
      },
    },
    isCompletedToday : {
      type : Boolean,
      default : false
    }
    
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
