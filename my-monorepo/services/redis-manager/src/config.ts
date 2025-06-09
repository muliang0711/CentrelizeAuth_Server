// src/config.ts
import dotenv from 'dotenv';
import path from 'path';

// Load .env file (default is root)
dotenv.config({ path: path.resolve(__dirname, '../env/.env') });

export const REDIS_NAME = process.env.REDIS_NAME || "error" ;
export const REDIS_PORT = process.env.REDIS_PORT || "error" ;
export const REDIS_GRPC_PORT = process.env.REDIS_GRPC_PORT || "error";

