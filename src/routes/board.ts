import express from 'express';
import * as boardRouter from '../controllers/board';
import passport from 'passport';

export const router = express.Router();

router.get('/:postId/post', passport.authenticate('jwt', { session: false }), boardRouter.getPost);
router.post('/post', passport.authenticate('jwt', { session: false }), boardRouter.createPost);
router.delete('/post', passport.authenticate('jwt', { session: false }), boardRouter.deletePost);
router.get('/', boardRouter.getPostsOfPage);
