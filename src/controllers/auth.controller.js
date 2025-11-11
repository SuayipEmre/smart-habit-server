import { JWT_EXPIRES_IN, JWT_SECRET, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendResponse } from "../utils/sendResponse.js";



const generateAccessToken = (user) =>
    jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    })

const generateRefreshToken = (user) =>
    jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    })


export const signUp = async (req, res, next) => {
    const { name, email, password, username } = req.body
    console.log('istek atıldı', req.body);

    try {
        if (!name || !email || !password || !username) {
            const error = new Error('All fields are required');
            error.status = 400;
            return next(error);
        }

        const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

        if (!isValidEmail) {
            const error = new Error('Please provide a valid email address');
            error.status = 400;
            return next(error);
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            const error = new Error('Email is already in use');
            error.status = 400;
            return next(error);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        })
        await newUser.save()

        const accessToken = generateAccessToken(newUser)
        const refreshToken = generateRefreshToken(newUser)

        newUser.refreshToken = refreshToken;

        sendResponse(res, 201, 'User registered successfully', {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            },
            accessToken,
            refreshToken,
        })

    } catch (error) {
        console.log('error', error);
        next(error);
    }
}


export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('istek atıldı', req.body);

        if (!email || !password) {
            const error = new Error('All fields are required');
            error.status = 400;
            return next(error);
        }

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            return next(error);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            return next(error);
        }
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken
        await user.save()


        sendResponse(res, 200, 'User signed in successfully', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
            },
            accessToken,
            refreshToken,
        })
    } catch (error) {
        console.log('error', error);
        next(error);
    }
}


export const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            const error = new Error('Refresh token is required')
            error.status = 400
            return next(error)
        }

        const user = await User.findOne({ refreshToken })
        if (!user) {
            const error = new Error('Invalid refresh token')
            error.status = 401
            return next(error)
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                const error = new Error('Expired or invalid refresh token')
                error.status = 401
                return next(error)
            }

            const newAccessToken = generateAccessToken(user)
            sendResponse(res, 200, 'Access token refreshed successfully', {
                accessToken: newAccessToken,
            })
        })
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    try {
        const userId = req.user._id
        await User.findByIdAndUpdate(userId, { refreshToken: null })

        sendResponse(res, 200, 'User signed out successfully')
    } catch (error) {
        next(error)
    }
}