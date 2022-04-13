import { DatabaseType, DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();
export const myDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_URL,
  port: 3306,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'nodejs',
  entities: ['src/models/*.ts'],
  logging: true,
  synchronize: true,
});
