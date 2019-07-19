import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Comment } from './comment';
import { FollowerFollowing } from './FollowerFollowing';
import { Post } from './Post';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, nullable: false, unique: true })
  email: string;

  @Column({ length: 15, nullable: false })
  nick: string;

  @Column({ length: 100, nullable: true })
  password: string;

  @Column({ length: 10, nullable: false, default: 'local' })
  provider: string;

  @Column({ length: 30, nullable: true })
  snsId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(type => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(type => Post, post => post.user)
  posts: Post[];

  @OneToMany(type => FollowerFollowing, ff => ff.follower)
  public followingConnection!: FollowerFollowing[];

  @OneToMany(type => FollowerFollowing, ff => ff.following)
  public followerConnection!: FollowerFollowing[];
}
