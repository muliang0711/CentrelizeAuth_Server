import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, '../../proto/userSessionRedis.proto'));
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

const redisClient = new grpcObj.user.SessionRedisService(
    'localhost:50053',
    grpc.credentials.createInsecure()
);

export default redisClient;
