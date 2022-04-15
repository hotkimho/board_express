import { NextFunction, Response, Request } from 'express';
import { Post } from '../../models/post';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { title, writer, content } = req.body;

  try {
    /*
    입력값 검증 부분
     */
    Post.save({
      title,
      writer,
      content,
    });
    console.log('게시글이 저장되었습니다');
    return res.status(200).json({
      message: '게시글이 저장되었습니다',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
