import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../proto/user_db.proto');

// Load proto with recommended settings
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

/**
 * Creates a gRPC client for UserService.
 * @param address - gRPC server address (e.g., 'localhost:50052')
 */
export function createDbClient(address: string) {
  return new grpcObj.user.UserService(
    address,
    grpc.credentials.createInsecure()
  );
}
