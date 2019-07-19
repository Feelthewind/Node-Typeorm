import * as express from 'express';
import { getRepository } from 'typeorm';
import { Post } from '../entity/Post';
import { isLoggedIn, isNotLoggedIn } from './middlewares';

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError')
  });
});

router.get('/', async (req, res, next) => {
  try {
    // const posts = await getRepository(Post)
    //   .createQueryBuilder('post')
    //   .leftJoinAndSelect('post.user', 'user')
    //   .select(['user.id', 'user.nick'])
    //   .orderBy('user.createdAt', 'DESC')
    //   .getMany();

    const posts = await getRepository(Post).find({
      relations: ['user'],
      order: {
        createdAt: 'DESC'
      },
      cache: true
    });

    res.render('main', {
      title: 'NodeBird',
      twits: posts,
      user: req.user,
      loginError: req.flash('loginError')
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
