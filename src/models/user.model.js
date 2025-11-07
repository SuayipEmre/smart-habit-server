import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    expoPushToken: {
        type: String,
        default: null,
      },

}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User
