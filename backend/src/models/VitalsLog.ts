import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('vitals_logs')
export class VitalsLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.vitalsLogs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  bloodPressure: string;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'int', nullable: true })
  fetalMovement: number;

  @CreateDateColumn()
  loggedAt: Date;
}
