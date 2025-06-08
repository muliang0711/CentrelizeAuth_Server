// src/config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load .env file (default is root)
dotenv.config({ path: path.resolve(__dirname, '../env/.env') });

export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhostfewrfwef';
export const MYSQL_PORT = Number(process.env.MYSQL_PORT || 33061);
export const MYSQL_USER = process.env.MYSQL_USER || 'root';
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'testdb';
