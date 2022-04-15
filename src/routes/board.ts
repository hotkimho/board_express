import express from 'express';
import * as boardRouter from '../controllers/board';
import passport from 'passport';

export const router = express.Router();

router.post('/post', passport.authenticate('jwt', { session: false }), boardRouter.createPost);
