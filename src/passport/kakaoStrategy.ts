import { PassportStatic } from 'passport';
import { Strategy } from 'passport-kakao';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export default (passport: PassportStatic) => {
  const userRepo = getRepository(User);
  passport.use(
    new (Strategy as any)(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await userRepo.findOne({
            snsId: profile.id,
            provider: 'kakao'
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = userRepo.create({
              email: profile!._json.kaccount_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: 'kakao'
            });
            await userRepo.save(newUser);
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
