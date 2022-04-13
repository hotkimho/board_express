import passport from 'passport';
import passport_local from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/user';

const LocalStrategy = passport_local.Strategy;

export const applyLocalPassport = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        try {
          const exUser = await User.findOne({ where: { username } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: '비밀번호가 틀립니다(테스트용)' });
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다(테스트용)' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
