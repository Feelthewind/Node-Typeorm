import bcrypt from 'bcrypt';
import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export default (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const exUser = await getRepository(User).findOne({ email });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
