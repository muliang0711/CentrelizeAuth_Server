const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../proto/userDb.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const client = new userPackage.UserService('localhost:50052', grpc.credentials.createInsecure());

function testRegisterUser() {
  const request = {
    userName: 'HY Tester',
    email: 'hytester@example.com',
    password: 'strongpassword123'
  };

  client.RegisterUser(request, (err, response) => {
    if (err) {
      console.error('❌ Register Error:', err);
    } else {
      console.log('✅ Register Response:', response);
    }
  });
}

function testLoginUser() {
  const request = {
    email: 'hytester@example.com',
    password: 'strongpassword123'
  };

  client.LoginUser(request, (err, response) => {
    if (err) {
      console.error('❌ Login Error:', err);
    } else {
      console.log('✅ Login Response:', response);
    }
  });
}

// 👇 开始测试
testRegisterUser();

setTimeout(() => {
  testLoginUser();
}, 1000); // 延迟1秒确保 Register 已完成
