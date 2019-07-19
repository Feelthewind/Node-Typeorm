import bcrypt from 'bcrypt';
import express from 'express';
import passport from 'passport';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { isLoggedIn, isNotLoggedIn } from './middlewares';

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  const userRepository = getRepository(User);
  try {
    const exUser = await userRepository.findOne({ email });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    const hash = await bcrypt.hash(password, 12);

    const newUser = userRepository.create({ email, nick, password: hash });
    await userRepository.save(newUser);
    console.log(newUser);
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate(
    'local',
    // { session: false },
    (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        req.flash('loginError', info.message);
        return res.redirect('/');
      }
      return req.login(user, loginError => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect('/');
      });
    }
  )(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(() => {});
  res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect('/');
  }
);

export default router;
