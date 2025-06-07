// src/grpc/GrpcManager.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { MainServerController } from '../controller/UserController';

export class GrpcManager {
    private static readonly PROTO_PATH = path.resolve(__dirname, '../../proto/auth_gateway.proto');
    private static server: grpc.Server;

    public static async initializeGrpcServer(): Promise<void> {
        // 1. Load proto definition
        const packageDef = protoLoader.loadSync(this.PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

        const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
        const userPackage = grpcObj.main;

        // 2. Create new gRPC server
        this.server = new grpc.Server();

        // 3. Add service implementation
        this.server.addService(userPackage.AuthGatewayService.service, {
            RegisterUser: MainServerController.RegisterUser,
            LoginUser: MainServerController.LoginUser,
            LoginWithToken: MainServerController.LoginWithToken,
            CheckSessionValid : MainServerController.CheckSessionValid
        });

        // 4. Start server
        const PORT = '0.0.0.0:50051';
        this.server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
            if (err) {
                console.error('❌ gRPC server error:', err.message);
                return;
            }
            console.log(`✅ gRPC server is running on ${PORT}`);
        });
    }
}
