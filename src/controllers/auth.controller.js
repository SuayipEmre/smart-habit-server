import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const signUp = async (req, res, next) => {
    const { name, email, password, username } = req.body


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

    const newUser = await new User({
        name,
        email,
        password: hashedPassword,
        username
    }).save()

    const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            },
            token
        }
    })
   } catch (error) {
    console.log('error', error);
    next(error);
   }
}


export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;

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

        const token = jwt.sign(
            {userId: user._id, email: user.email},
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        )

        res.status(200).json({
            status: 'success',
            message: 'User signed in successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                },
                token
            }
        })
    } catch (error) {
        console.log('error', error);
        next(error);
    }
}


export const signOut = async(req, res, next) => {
  try {
    const userId = req.user._id;

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })

    res.status(200).json({
        status: 'success',
        message: 'User signed out successfully please remove token from client side',
        data: null
    })
    
  } catch (error) {
    next(error);
  }
}