import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const router = express.Router();

router.get('/', async function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userRepository = getRepository(User);
  try {
    const users = await userRepository.find();
    return res.render('sequelize', { users });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
