import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Album } from './Album';
import { Author } from './Author';
import { PhotoMetadata } from './PhotoMetadata';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100
  })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column('double')
  views: number;

  @Column()
  isPublished: boolean;

  @OneToOne(type => PhotoMetadata, photoMetadata => photoMetadata.photo)
  metadata: PhotoMetadata;

  @ManyToOne(type => Author, author => author.photos)
  author: Author;

  @ManyToMany(type => Album, album => album.photos)
  albums: Album[];
}
