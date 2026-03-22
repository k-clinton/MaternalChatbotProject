import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../models/User';
import { VitalsLog } from '../models/VitalsLog';
import { Appointment } from '../models/Appointment';
import { Medication } from '../models/Medication';

dotenv.config();

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'maternal_health',
  entities: [User, VitalsLog, Appointment, Medication],
  migrations: ['src/database/migrations/*.ts'], // Path to your migration files
  synchronize: false, // Set to false when using migrations!
  logging: true,
};

const dataSource = new DataSource(databaseConfig);

export default dataSource;

