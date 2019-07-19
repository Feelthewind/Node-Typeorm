import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import passportConfig from './passport';
import authRouter from './routes/auth';
import pageRouter from './routes/page';
import postRouter from './routes/post';
import userRouter from './routes/user';

config({ path: path.resolve(__dirname, '../.env') });

createConnection()
  .then(async connection => {
    // create express app
    const app = express();
    passportConfig(passport);

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    app.set('port', process.env.PORT || 8001);

    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
    // app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          httpOnly: true,
          secure: false
        }
      })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/', pageRouter);
    app.use('/auth', authRouter);
    app.use('/post', postRouter);
    app.use('/user', userRouter);

    app.use((req, res, next) => {
      const err = new Error('Not Found');
      next(err);
    });

    app.use((err: Error, req: Request, res: Response) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
      res.status(500);
      res.render('error');
    });

    app.listen(app.get('port'), () => {
      console.log(app.get('port'), '번 포트에서 대기 중');
    });
    // app.use('/users', userRouter);
    // app.use('/comments', commentRouter);

    // register express routes from defined application routes
    // Routes.forEach(route => {
    //   (app as any)[route.method](
    //     route.route,
    //     (req: Request, res: Response, next: Function) => {
    //       const result = new (route.controller as any)()[route.action](
    //         req,
    //         res,
    //         next
    //       );
    //       if (result instanceof Promise) {
    //         result.then(result =>
    //           result !== null && result !== undefined
    //             ? res.send(result)
    //             : undefined
    //         );
    //       } else if (result !== null && result !== undefined) {
    //         res.json(result);
    //       }
    //     }
    //   );
    // });

    // setup express app here

    // ...

    // start express server
    // console.log(
    //   'Express server has started on port 3000. Open http://localhost:3000/users to see results'
    // );
  })
  .catch(error => console.log(error));
