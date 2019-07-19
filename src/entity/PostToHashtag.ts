import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';
import { Hashtag } from './Hashtag';
import { Post } from './Post';

@Entity()
export class PostToHashtag extends BaseEntity {
  @PrimaryColumn()
  postId: number;

  @PrimaryColumn()
  hashtagId: number;

  @ManyToOne(type => Post, post => post.postToHashtags, { primary: true })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(type => Hashtag, hashtag => hashtag.postToHashtags, {
    primary: true
  })
  @JoinColumn({ name: 'hashtagId' })
  hashtag: Hashtag;
}
