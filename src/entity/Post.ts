import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PostToHashtag } from './PostToHashtag';
import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 140, nullable: false })
  content: string;

  @Column({ length: 200, nullable: true })
  img: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(type => User, user => user.posts)
  user: User;

  @OneToMany(type => PostToHashtag, postToHashtag => postToHashtag.post)
  public postToHashtags!: PostToHashtag[];
}
