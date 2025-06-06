// src/server.ts

import { RedisClient } from './Redis/redisClient';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {SessionRedisController} from './Controller/UserController';

// 1. Load proto file
const userProtoPath = path.resolve(__dirname, '../proto/user.proto');
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
    keepCase: true,
    longs: String,
    defaults: true,
    arrays: true,
    objects: true,
    enums: String,
    oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(userProtoDefinition) as any;
const userPackage = grpcObj.user;

// 2. Start gRPC server
async function main() {
    try {
        await RedisClient.init();
        console.log('✅ Redis Client Initialized');

        const server = new grpc.Server();

        // 3. Register service and handler
        server.addService(userPackage.SessionRedisService.service, {
            StoreSessionToRedis: SessionRedisController.StoreSessionToRedis,
            CheckSessionInRedis: SessionRedisController.CheckSessionInRedis,
        });

        const PORT = '0.0.0.0:50053';
        server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
            if (err) {
                console.error('❌ Failed to start gRPC server:', err);
                return;
            }
            console.log(`✅ gRPC server running at ${PORT}`);
            server.start(); // Important: Start the server!
        });
    } catch (error) {
        console.error('❌ Failed to Initialize Redis Client or gRPC:', error);
    }
}

main();
