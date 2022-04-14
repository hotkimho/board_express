import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

export const applyLocal = () => {
  const localPassportConfig = {
    usernameField: 'username',
    passwordField: 'password',
  };
  const localPassportVerify = async (username: string, password: string, done: any) => {
    try {
      const exUser = await User.findOne({ where: { username } });
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          return done(null, exUser);
        }
      }
      return done(null, false, { message: '아이디 또는 비밀번호가 틀렸습니다' });
    } catch (error) {
      console.error(error);
      done(error);
    }
  };
  passport.use('local', new LocalStrategy(localPassportConfig, localPassportVerify));
};
