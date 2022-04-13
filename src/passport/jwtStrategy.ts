import passportJwt from 'passport-jwt';
import passport from 'passport';
import { User } from '../models/user';

const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;

export const applyJwtPassport = () => {
  const options = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwtSecret,
    issuer: 'test',
    audience: 'test',
  };

  const jwtVerify = async (payload: any, done: any) => {
    console.log(payload);
    try {
      const exUser = await User.findOne({ where: payload.username });
      if (exUser) {
        return done(null, exUser);
      }
      done(null, false, { message: '잘못된 정보입니다.' });
    } catch (error) {
      console.error(error);
      done(error);
    }
  };
  passport.use('jwt', new jwtStrategy(options, jwtVerify));
};
