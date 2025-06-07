import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, '../proto/user_db.proto'));
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

export const dbClient = new grpcObj.user.DatabaseService(
  'localhost:50052', 
  grpc.credentials.createInsecure()
);

