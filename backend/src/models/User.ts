import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VitalsLog } from './VitalsLog';
import { Appointment } from './Appointment';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'pregnant' })
  role: string; // 'pregnant', 'provider', 'caregiver'

  @Column({ type: 'int', nullable: true })
  weeksPregnant: number;

  @OneToMany(() => VitalsLog, vitalsLog => vitalsLog.user)
  vitalsLogs: VitalsLog[];

  @OneToMany(() => Appointment, appointment => appointment.user)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
