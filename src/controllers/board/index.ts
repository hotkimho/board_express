import { NextFunction, Response, Request } from 'express';
import { myDataSource } from '../../data-source';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  try {
    jwt.verify(
      req.cookies.accessToken,
      process.env.jwtSecret,
      async (err: VerifyErrors, payload: JwtPayload) => {
        const username = payload.username;
        const user = await myDataSource
          .getRepository(User)
          .createQueryBuilder('user')
          .where('user.username = :username', { username })
          .getOne();
        Post.save({
          title,
          content,
          writer: user.username,
          user,
        });
        res.status(200).json({
          message: '성공적으로 글이 작성되었습니다.',
        });
      },
    );
  } catch (error) {
    console.error(error);
    const err = new Error();
    err.message = 'Save post Error';
    next(err);
  }
};
