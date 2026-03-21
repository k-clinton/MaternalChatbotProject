import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'maternal_health.sqlite',
  // Path adjustment: Since we run this from src or dist, use relative path or __dirname carefully
  entities: [__dirname + '/../models/**/*.ts'], // Use .ts for development
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
};

const dataSource = new DataSource(databaseConfig);

export default dataSource;

