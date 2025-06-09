import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { UserController } from './Controllers/UserController';
import { MySQLClient } from './dbClient/dbCilent';

const PROTO_PATH = path.resolve(__dirname, '../proto/user_db.proto');
console.log('✅ PROTO_PATH =', PROTO_PATH);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String, 
    defaults: true,
    oneofs: true,
});

import {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  MYSQL_GRPC_PORT
} from './config';
const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;
const userPackage = grpcObject.user;

async function main() {

    await MySQLClient.initialize(MYSQL_HOST , MYSQL_PORT ,MYSQL_USER , MYSQL_PASSWORD , MYSQL_DATABASE);

    const server = new grpc.Server();
    server.addService(userPackage.UserService.service, {
        RegisterUserDb: UserController.RegisterUser,
        LoginUserDb: UserController.LoginUser,
        StoreSessionDataToDb: UserController.StoreSessionDataToDb,
        CheckSessionValidInDb: UserController.CheckSessionInDb,
        IsEmailExistsInDb: UserController.IsEmailExistsInDb,
    });

    const PORT =  MYSQL_GRPC_PORT;
    server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('❌ Failed to start gRPC server:', err);
            return;
        }
        console.log(`✅ gRPC server running at ${PORT}`);
    });
}

main();
