import express from 'express';
import * as authRouter from '../controllers/user/auth';
import passport from 'passport';

export const router = express.Router();

router.post('/signup', authRouter.signup);
router.post('/login', authRouter.login);
router.get('/test', passport.authenticate('jwt', { session: false }), authRouter.tokenTest);
//router.use('/auth', authRouter);
