import express from 'express';
import * as authRouter from '../controllers/user/auth';

export const router = express.Router();

router.post('/signup', authRouter.signup);
router.post('/login', authRouter.login);
//router.use('/auth', authRouter);
