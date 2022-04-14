import passportJwt from 'passport-jwt';
import passport from 'passport';
import { User } from '../models/user';

const JWTStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export const applyJwt = () => {
  const JWTConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwtSecret,
  };
  const JWTVerify = async (payload: any, done: any) => {
    try {
      console.log('Qweqe');
      const exUser = await User.findOne({ where: { username: payload.username } });
      if (exUser) {
        return done(null, exUser);
      }
      done(null, false, { message: 'Token Error' });
    } catch (error) {
      console.error(error);
      done(error);
    }
  };
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};
