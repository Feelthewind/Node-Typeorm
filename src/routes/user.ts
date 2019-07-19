import * as express from 'express';
import { getRepository } from 'typeorm';
import { FollowerFollowing } from '../entity/FollowerFollowing';
import { isLoggedIn } from './middlewares';

const router = express.Router();

// router.get('/', async (req, res, next) => {
//   try {
//     const users = await getRepository(User).find();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// router.post('/', async (req: Request, res: Response, next) => {
//   try {
//     const userRepository = await getRepository(User);
//     const user = userRepository.create({
//       name: req.body.name,
//       age: req.body.age,
//       married: req.body.married
//     });
//     await userRepository.save(user);

//     res.status(201).json(user);
//   } catch (error) {}
// });

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const followRepo = getRepository(FollowerFollowing);
    const newFollow = followRepo.create({
      followerId: req.user.id,
      followingId: req.params.id
    });
    await followRepo.save(newFollow);
    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
