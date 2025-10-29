import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authorize = async(req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Authorization header missing or malformed');
            error.status = 401;
            return next(error);
        }

        const token = authHeader.split(' ')[1];

        if(!token) {
            const error = new Error('Token missing');
            error.status = 401;
            return next(error);
        }

        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(verifiedToken.userId).select('-password');

        if(!user){
            const error = new Error('User not found');
            error.status = 404;
            return next(error);
        }

        req.user = user;
        next()

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: error.message
        })
        next(error)
    }
}

export default authorize