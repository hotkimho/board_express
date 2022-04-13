import express, { NextFunction, Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../../models/user';
import passport from 'passport';

export const router = express.Router();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { username } });
    if (exUser) {
      return res
        .json({
          message: '이미 있는 사용자입니다',
        })
        .redirect('/');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.save({
      username,
      password: hash,
    });
    console.log('회원가입 완료');
    return res.json({
      username,
      password,
      hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res
        .json({
          message: info.message,
        })
        .redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
};
