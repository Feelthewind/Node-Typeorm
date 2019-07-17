import * as express from 'express';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const users = await getRepository(User).find();
    res.json(users);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next) => {
  try {
    const userRepository = await getRepository(User);
    const user = userRepository.create({
      name: req.body.name,
      age: req.body.age,
      married: req.body.married
    });
    await userRepository.save(user);

    res.status(201).json(user);
  } catch (error) {}
});

export default router;
