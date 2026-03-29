import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { VitalsLog } from './VitalsLog';
import { Appointment } from './Appointment';
import { Medication } from './Medication';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'pregnant' })
  role: string; // 'pregnant', 'provider', 'caregiver'

  @Column({ type: 'int', nullable: true })
  weeksPregnant: number;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'varchar', nullable: true })
  emergencyContact: string;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: false })
  whatsappNotifications: boolean;

  @Column({ nullable: true })
  whatsappNumber: string;

  @OneToMany(() => VitalsLog, vitalsLog => vitalsLog.user)
  vitalsLogs: VitalsLog[];

  @OneToMany(() => Appointment, appointment => appointment.user)
  appointments: Appointment[];

  @OneToMany(() => Medication, medication => medication.user)
  medications: Medication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
