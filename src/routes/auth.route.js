import express from 'express';
import { refreshAccessToken, signIn, signOut, signUp } from '../controllers/auth.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/refresh', refreshAccessToken)
router.post('/signOut', authorize, signOut)



export default router;