import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  dueDate: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
