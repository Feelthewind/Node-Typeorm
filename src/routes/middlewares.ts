import { Request, Response } from 'express';

const isLoggedIn = (req: Request, res: Response, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

const isNotLoggedIn = (req: Request, res: Response, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

export { isLoggedIn, isNotLoggedIn };
