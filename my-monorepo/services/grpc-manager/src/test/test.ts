// src/grpc/testClient.ts

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { tokenManager } from '../service/jwtService';
// 1. 加载 AuthGatewayService 的 proto 文件
const PROTO_PATH = path.resolve(__dirname, '../../proto/auth_gateway.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

// 2. 创建 gRPC 客户端实例
// 1. This code is for creating the AuthGatewayService client
const authClient = new grpcObj.main.AuthGatewayService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 3. 定义测试函数

// 1. This code is for testing RegisterUser RPC
function testRegisterUser() {
  authClient.RegisterUser(
    { userName: 'HY', email: 'hya112@example.com', password: 'secret' },
    (err: grpc.ServiceError | null, res: any) => {
      if (err) {
        console.error('Test 1 : RegisterUser Error:', err.message);
      } else {
        console.log('Test 1 : RegisterUser Response:', res);
      }
    }
  );
}

// 1. This code is for testing LoginUser RPC
function testLoginUser() {
  authClient.LoginUser(
    { email: 'hya112@example.com', password: 'secret' },
    (err: grpc.ServiceError | null, res: any) => {
      if (err) {
        console.error('Test 2 : LoginUser Error:', err.message);
      } else {
        console.log('Test 2 : LoginUser Response:', res);
      }
    }
  );
}

// 1. This code is for testing CheckSessionValid RPC
function testCheckSessionValid(sessionID: string) {
  authClient.CheckSessionValid(
    { sessionID },
    (err: grpc.ServiceError | null, res: any) => {
      if (err) {
        console.error('Test 3 : CheckSessionValid Error:', err.message);
      } else {
        console.log('Test 3 : CheckSessionValid Response:', res);
      }
    }
  );
}

// 1. This code is for testing Logout RPC
function testLogout(sessionID: string) {
  authClient.Logout(
    { sessionID },
    (err: grpc.ServiceError | null, res: any) => {
      if (err) {
        console.error('Test 4 : Logout Error:', err.message);
      } else {
        console.log('Test 4 : Logout Response:', res);
      }
    }
  );
}

// 1. This code is for testing LoginWithToken RPC
function testLoginWithToken(token: string) {
  authClient.LoginWithToken(
    { token },
    (err: grpc.ServiceError | null, res: any) => {
      if (err) {
        console.error('Test 5 : LoginWithToken Error:', err.message);
      } else {
        console.log('Test 5 : LoginWithToken Response:', res);
      }
    }
  );
}

// 4. 顺序执行各个测试
async function main() {
  testRegisterUser();
  setTimeout(() => {
    testLoginUser();
    const fakeSessionID = 'bf3148946bf996d31c9b7fff523c4d09089cec30eb092e213ea8c46f4edce09a';
    const fakeToken = tokenManager.generateToken({uuid : "dwiehyvbiub" , email : "wd2ewiiuh" , name : "weiygiu" })
    testCheckSessionValid(fakeSessionID);
    testLogout(fakeSessionID);
    testLoginWithToken(fakeToken);
  }, 1000);
}

main();
