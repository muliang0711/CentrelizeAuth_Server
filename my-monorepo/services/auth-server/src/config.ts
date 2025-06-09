// src/config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load .env file (default is root)
dotenv.config({ path: path.resolve(__dirname, '../env/.env') });

export const MAINSERVER_GRPC_PORT = process.env.MAINSERVER_GRPC_PORT || "error" ;
export const MYSQL_GRPC_PORT = process.env.MYSQL_GRPC_PORT!.trim();
export const REDIS_GRPC_PORT = process.env.REDIS_GRPC_PORT!.trim();
