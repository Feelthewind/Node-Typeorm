import * as express from 'express';
import { getRepository } from 'typeorm';
import { Comment } from '../entity/comment';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  let comments = await getRepository(Comment)
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.user', 'user')
    .where('user.id = :userId')
    .setParameters({ userId: req.params.id })
    .getMany();
  console.log(comments);
  res.json(comments);
});

router.post('/', async (req, res, next) => {
  const commentRepository = getRepository(Comment);
  const comment = commentRepository.create({
    user: req.body.id,
    comment: req.body.comment
  });
  await commentRepository.save(comment);
  // res.status(201).json(result);
});

router.patch('/:id', async (req, res, next) => {
  const commentReposjitory = getRepository(Comment);
  const result = await commentReposjitory.update(req.params.id, {
    comment: req.body.comment
  });
  res.json(result);
});

router.delete('/:id', async (req, res, next) => {
  const commentReposjitory = getRepository(Comment);
  const result = await commentReposjitory.delete(req.params.id);
  res.json(result);
});

export default router;
