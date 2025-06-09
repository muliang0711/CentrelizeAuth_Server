import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../proto/userSessionRedis.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

/**
 * Creates a Redis gRPC client with custom address (e.g. 'localhost:50053')
 * @param address gRPC address to connect (e.g., 'localhost:50053')
 */
export function createRedisClient(address: string) {
    return new grpcObj.user.SessionRedisService(
        address,
        grpc.credentials.createInsecure()
    );
}
