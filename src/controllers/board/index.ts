import { NextFunction, Response, Request } from 'express';
import { myDataSource } from '../../data-source';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

// export const patchPost = async (req: Request, res: Response, next: NextFunction) => {
//   const { title, content } = req.body;
//   //
//   // try {
//   //   jwt.verify(req.cookies.accessToken,
//   //     process.env.jwtSecret, async (err: VerifyErrors, payload: JwtPayload) => {
//   //       const username = payload.username;
//   //
//   //     });
//   //   const postRepository = myDataSource.getRepository(Post);
//
//   //}
// };

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const postId = parseInt(req.query.postId as string);

  try {
    const postRepository = myDataSource.getRepository(Post);
    const userRepository = myDataSource.getRepository(User);

    const user = await userRepository.find({
      relations: ['posts'],
    });
    const postToRemove = await postRepository.find({
      relations: ['user'],
      where: { user: { id: postId } },
    });
    console.log(postToRemove);
    // await postRepository.remove(postToRemove);
    res.status(200).json(postToRemove);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  const postId = parseInt(req.params.postId as string);

  try {
    const postRepository = myDataSource.getRepository(Post);
    const post = await postRepository.findOneBy({ id: postId });
    return res.status(200).json({
      title: post.title,
      writer: post.writer,
      content: post.content,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getPostsOfPage = async (req: Request, res: Response, next: NextFunction) => {
  const limit = 10;
  const page = parseInt(req.query.page as string) || 1;

  try {
    const offset = (page - 1) * 10;
    const posts = await myDataSource
      .getRepository(Post)
      .createQueryBuilder('post')
      .select(['post.id', 'post.title', 'post.writer', 'post.created_at'])
      .orderBy('post.id', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();
    return res.status(200).send(posts);
  } catch (error) {
    console.error(error);
    const err = new Error();
    err.message = 'getIndexPagePosts Error';
    next(err);
  }
};
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
