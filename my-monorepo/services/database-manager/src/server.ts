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

async function waitForDatabaseConnection(retries = 10, delayMs = 3000): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`⏳ Attempting DB connection (try ${attempt}/${retries})...`);
            await MySQLClient.initialize(MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);
            console.log('✅ DB Connected.');
            return;
        } catch (err) {
            if (err instanceof Error) {
                console.error(`❌ DB Connection failed:`, err.message);
            } else {
                console.error(`❌ DB Connection failed:`, err);
            }
            if (attempt < retries) {
                await new Promise(res => setTimeout(res, delayMs));
            } else {
                throw new Error('❌ Failed to connect to MySQL after multiple attempts.');
            }
        }
    }
}

async function main() {

    await waitForDatabaseConnection();

    await MySQLClient.initialize(MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE);

    const server = new grpc.Server();
    server.addService(userPackage.UserService.service, {
        RegisterUserDb: UserController.RegisterUser,
        LoginUserDb: UserController.LoginUser,
        StoreSessionDataToDb: UserController.StoreSessionDataToDb,
        CheckSessionValidInDb: UserController.CheckSessionInDb,
        IsEmailExistsInDb: UserController.IsEmailExistsInDb,
    });

    const PORT = MYSQL_GRPC_PORT;
    server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('❌ Failed to start gRPC server:', err);
            return;
        }
        console.log(`✅ gRPC server running at ${PORT}`);
    });
}

main();
