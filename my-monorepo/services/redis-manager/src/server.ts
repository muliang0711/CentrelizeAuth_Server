import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {SessionRedisController} from './Controller/UserController';
import { RedisManager} from './redisManager'
require('dotenv').config();
import {
    REDIS_NAME , 
    REDIS_PORT ,
    REDIS_GRPC_PORT
} from './config';

// 1. Load proto file
const userProtoPath = path.resolve(__dirname, '../proto/userSessionRedis.proto');
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

        await RedisManager.init(REDIS_NAME , REDIS_PORT); 
        console.log('✅ Redis Client Initialized');

        const server = new grpc.Server();

        // 3. Register service and handler
        server.addService(userPackage.SessionRedisService.service, {
            StoreSessionDataToRedis: SessionRedisController.StoreSessionDataToRedis,
            CheckSessionDataInRedis: SessionRedisController.CheckSessionDataInRedis,
            DeleteSessionDataInRedisByID: SessionRedisController.DeleteSessionDataInRedisById
        });

        const PORT = REDIS_GRPC_PORT ;
        server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
            if (err) {
                console.error('❌ Failed to start gRPC server:', err);
                return;
            }
            console.log(`✅ gRPC server running at ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to Initialize Redis Client or gRPC:', error);
    }
}

main();
