import express, { Express, Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { myDataSource } from './data-source';
import { passportConfig } from './passport';
import * as authRouter from './routes/auth';

dotenv.config();
const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passportConfig();

myDataSource
  .initialize()
  .then(() => {
    console.log('Connect DB');
  })
  .catch((err) => {
    console.error(err);
  });

app.use('/auth', authRouter.router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: 'error',
  });
});

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, '에서 대기 중');
});
