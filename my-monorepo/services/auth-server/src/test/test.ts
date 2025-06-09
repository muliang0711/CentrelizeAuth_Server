// src/grpc/testClient.ts

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { tokenManager } from '../service/jwtService';

// 1. Load AuthGatewayService proto
const PROTO_PATH = path.resolve(__dirname, '../../proto/auth_gateway.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;

// 2. Create AuthGatewayService gRPC client
const authClient = new grpcObj.main.AuthGatewayService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// 3. Define test user & session data
const testUser = {
  userName: 'HY',
  email: 'hya1123@example.com',
  password: 'secret',
  sessionID: '',
  token: '',
};

// 4. This code is for testing RegisterUser RPC
function testRegisterUser(): void {
  authClient.RegisterUser(
    {
      userName: testUser.userName,
      email: testUser.email,
      password: testUser.password,
    },
    (err: grpc.ServiceError | null, res: any) => {
      if (err) {
        console.error('Test 1 : RegisterUser Error:', err.message);
      } else {
        console.log('Test 1 : RegisterUser Response:', res);
      }
    }
  );
}

// 5. This code is for testing LoginUser RPC
function testLoginUser(): void {
  authClient.LoginUser(
    {
      email: testUser.email,
      password: testUser.password,
    },
    (err: grpc.ServiceError | null, res: any) => {
      if (err) {
        console.error('Test 2 : LoginUser Error:', err.message);
      } else {
        console.log('Test 2 : LoginUser Response:', res);
        testUser.sessionID = res?.sessionData?.sessionID || '';
        testUser.token = res?.token || '';
      }
    }
  );
}

// 6. This code is for testing CheckSessionValid RPC
function testCheckSessionValid(sessionID: string): void {
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

// 7. This code is for testing Logout RPC
function testLogout(sessionID: string): void {
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

// 8. This code is for testing LoginWithToken RPC
function testLoginWithToken(token: string): void {
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

// 9. Run all tests in sequence using setTimeout
async function main(): Promise<void> {
  testRegisterUser();

  setTimeout(() => {
    testLoginUser();
  }, 1000);

  setTimeout(() => {
    const sessionID = testUser.sessionID || 'fake-session-id';
    testCheckSessionValid(sessionID);
  }, 2000);

  setTimeout(() => {
    const sessionID = testUser.sessionID || 'fake-session-id';
    testLogout(sessionID);
  }, 3000);

  setTimeout(() => {
    const token = testUser.token || tokenManager.generateToken({
      uuid: 'fake-uuid',
      email: testUser.email,
      name: testUser.userName,
    });
    testLoginWithToken(token);
  }, 4000);
}

main();
