// src/server.ts

import { RedisManager } from '../../redis-manager/dist/redisManager';
import { MySQLManager } from '../../database-manager/dist/dbManager';
import { GrpcManager } from '../../grpc-manager/dist/grpcManager';

async function startServer() {
  try {
    await RedisManager.initializeRedis();
    await MySQLManager.initialize();
    await GrpcManager.initializeGrpcServer();
  } catch (err) {
    console.error('❌ Startup error:', err);
  }
}

startServer();
