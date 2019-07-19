import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class FollowerFollowing extends BaseEntity {
  @PrimaryColumn()
  followerId: number;

  @PrimaryColumn()
  followingId: number;

  @ManyToOne(type => User, user => user.followingConnection, { primary: true })
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(type => User, user => user.followerConnection, { primary: true })
  @JoinColumn({ name: 'followingId' })
  following: User;
}
