import express, { NextFunction, Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import passport from 'passport';

export const router = express.Router();

// router.get('a', (req, res, next) => {
//   res.send('auth');
// });
export const a = async (req: Request, res: Response, next: NextFunction) => {
  return res.send('hoho');
};
router.post('signup', async (req, res, next) => {
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
    await User.create({
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
});

router.post('login', (req, res, next) => {
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
});
