import { PassportStatic } from 'passport';
import { getRepository } from 'typeorm';
import { FollowerFollowing } from '../entity/FollowerFollowing';
import { User } from '../entity/User';
import kakaoStrategy from './kakaoStrategy';
import localStrategy from './localStrategy';

export default (passport: PassportStatic) => {
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const followerFollowings = await getRepository(FollowerFollowing)
        .createQueryBuilder('follwer_following')
        .where('followerId = :id', { id })
        .orWhere('followingId = :id', { id })
        .leftJoinAndSelect('follwer_following.following', 'followings')
        .leftJoinAndSelect('follwer_following.follower', 'followers')
        .getMany();

      const user = await User.findOne({ id });
      // console.log(user);

      const result = {
        followings: [],
        followers: []
      };

      followerFollowings.forEach(ff => {
        if (ff.followerId == id) {
          result.followings.push((ff as any).following);
        } else if (ff.followingId == id) {
          result.followers.push((ff as any).follower);
        }
      });

      // console.log(followerFollowings);

      // console.dir(result);

      const merged = Object.assign(user, result);

      // const result = await FollowerFollowing.find({
      //   join: {
      //     alias: 'followerFollowing',
      //     innerJoinAndSelect: {
      //       following: 'followerFollowing.following'
      //     }
      //   },
      //   where: {
      //     followerId: id,
      //     followingId: id
      //   },
      // });

      // const user = await getRepository(User)
      //   .createQueryBuilder('user')
      //   .where('user.id = :id', { id })
      //   .innerJoinAndSelect('user.followings', 'follow')
      //   .innerJoinAndSelect('follow.following', 'following')
      //   .getOne();
      // console.dir(user.followings[0].following);
      done(null, merged);
    } catch (error) {
      done(error);
    }
  });

  localStrategy(passport);
  kakaoStrategy(passport);
};
