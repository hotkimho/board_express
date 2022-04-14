import express, { NextFunction, Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import passport from 'passport';

export const router = express.Router();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    passport.authenticate('local', (error, user, info) => {
      if (error || !user) {
        return res.status(400).send('error');
      }
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          return res.status(400).send(loginError);
        }
        const token = jwt.sign(
          {
            username: user.username,
            password: user.password,
          },
          process.env.jwtSecret,
        );
        return res.status(200).json({
          token,
          message: 'success',
        });
      });
    })(req, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const tokenTest = async (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    message: 'success',
  });
};

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
