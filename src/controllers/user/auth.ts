import express, { NextFunction, Response, Request } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';

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

export const tokenTest = async (req: Request, res: Response, next: NextFunction) => {
  console.log('tokenTest');
  try {
    res.json({
      result: true,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { username } });
    if (exUser) {
      const result = await bcrypt.compare(password, exUser.password);
      if (result) {
        const token = jwt.sign(
          {
            username: exUser.username,
            password: exUser.password,
          },
          process.env.jwtSecret,
          {
            expiresIn: '20m',
            issuer: 'kimho',
          },
        );
        return res.json({
          code: 200,
          token,
        });
      }
    }
    return res.status(401).json({
      code: 401,
      message: '아이디 또는 비밀번호가 잘못되었습니다',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '다시 입력해주세요',
    });
  }
};

// passport-local
// export const login = (req: Request, res: Response, next: NextFunction) => {
//   passport.authenticate('local', (authError, user, info) => {
//     if (authError) {
//       console.error(authError);
//       return next(authError);
//     }
//     if (!user) {
//       return res
//         .json({
//           message: info.message,
//         })
//         .redirect('/');
//     }
//     return req.login(user, (loginError) => {
//       if (loginError) {
//         console.error(loginError);
//         return next(loginError);
//       }
//       return res.redirect('/');
//     });
//   })(req, res, next);
// };
