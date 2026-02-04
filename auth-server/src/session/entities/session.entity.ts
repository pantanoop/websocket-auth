import { User } from '../../auth/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity('Sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @Column()
  sessionId: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user: User;
}
