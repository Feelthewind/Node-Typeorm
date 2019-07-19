import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { getRepository } from 'typeorm';
import { Hashtag } from '../entity/Hashtag';
import { Post } from '../entity/Post';
import { PostToHashtag } from '../entity/PostToHashtag';
import { isLoggedIn } from './middlewares';

const router = express.Router();

fs.readdir('uploads', error => {
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        path.basename(file.originalname, ext) + new Date().valueOf() + ext
      );
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const postRepo = getRepository(Post);
    const newPost = postRepo.create({
      content: req.body.content,
      img: req.body.url,
      user: req.user.id
    });
    await postRepo.save(newPost);
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
      const result: any = await Promise.all(
        hashtags.map(tag => Hashtag.findOrCreate(tag.slice(1).toLowerCase()))
      );
      newPost.postToHashtags = result;
      postRepo.save(newPost);
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  console.log({ query });
  if (!query) {
    return res.redirect('/');
  }
  try {
    // const hashtag = await Hashtag.findOne({ title: query });
    const posts = await getRepository(PostToHashtag)
      .createQueryBuilder('postToHashtag')
      .leftJoin('postToHashtag.hashtag', 'hashtag')
      .leftJoinAndSelect('postToHashtag.post', 'post')
      .leftJoinAndSelect('post.user', 'user')
      .where('hashtag.title = :query', { query })
      .getMany();

    console.log(posts);

    const result = [];
    posts.forEach(p => {
      result.push(p.post);
    });

    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: result
    });
  } catch (error) {}
});

export default router;
