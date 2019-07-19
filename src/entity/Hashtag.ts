import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PostToHashtag } from './PostToHashtag';

@Entity()
export class Hashtag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 15, nullable: false, unique: true })
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(type => PostToHashtag, postToHashtag => postToHashtag.hashtag)
  public postToHashtags!: PostToHashtag[];

  static async findOrCreate(title: string) {
    const hashtagRepo = getRepository(Hashtag);

    let hashtag = await hashtagRepo.findOne({ title });
    if (hashtag) return hashtag;
    hashtag = new Hashtag();
    hashtag.title = title;

    return hashtagRepo.save(hashtag);
  }
}
