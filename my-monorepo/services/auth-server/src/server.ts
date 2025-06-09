// src/main.ts
import { GrpcManager } from "./grpc/mainServer";
import { createDbClient } from "./grpc/dbClient";
import { createRedisClient } from "./grpc/rdClient";
import { ClientHolder } from "./grpc/ClientHolders";

import {
    MAINSERVER_GRPC_PORT,
    REDIS_GRPC_PORT,
    MYSQL_GRPC_PORT
} from './config';

console.log('🚀 Booting Main Server...');

// Export easy aliases to use in controller directly
export const dbClient = createDbClient(MYSQL_GRPC_PORT);
export const redisClient = createRedisClient(REDIS_GRPC_PORT);

ClientHolder.dbClient = dbClient;
ClientHolder.redisClient = redisClient;

async function main() {
    try {
        console.log(`🟢 Connecting to DB at ${MYSQL_GRPC_PORT}`);
        console.log(`🟢 Connecting to Redis at ${REDIS_GRPC_PORT}`);

        console.log(`🟢 Starting gRPC Main Server at ${MAINSERVER_GRPC_PORT}`);
        await GrpcManager.initializeGrpcServer(MAINSERVER_GRPC_PORT);
        console.log('✅ All services started successfully!');
    } catch (err) {
        console.error('❌ Startup failed:', err);
    }
}

main();
