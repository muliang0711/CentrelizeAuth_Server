// test/userDb.test.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.resolve(__dirname, '../proto/user_db.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const userPackage = grpcObject.user;

const client = new userPackage.UserService('localhost:50052', grpc.credentials.createInsecure());

const testUser = {
  userName: 'HY Tester',
  email: 'hytester222@example.com',
  password: 'strongpassword123'
};

function testRegisterUser() {
  return new Promise((resolve) => {
    client.RegisterUserDb(testUser, (err, response) => {
      if (err) {
        console.error('❌ RegisterUserDb Error:', err.message);
      } else {
        console.log('✅ RegisterUserDb Response:', response);
      }
      resolve();
    });
  });
}

function testLoginUser() {
  return new Promise((resolve) => {
    const request = {
      email: testUser.email,
      password: testUser.password
    };
    client.LoginUserDb(request, (err, response) => {
      if (err) {
        console.error('❌ LoginUserDb Error:', err.message);
      } else {
        console.log('✅ LoginUserDb Response:', response);
        resolve(response); // Return for later use
      }
    });
  });
}

function testStoreSessionToDB(sessionData) {
  return new Promise((resolve) => {
    const request = { sessionData };

    client.StoreSessionDataToDb(request, (err, response) => {
      if (err) {
        console.error('❌ StoreSessionToDB Error:', err.message);
      } else {
        console.log('✅ StoreSessionToDB Response:', response);
      }
      resolve(); // 不返回数据是因为只是展示调用过程
    });
  });
}

function testCheckSessionInDB(sessionID) {
  return new Promise((resolve) => {
    const request = { sessionID };

    client.CheckSessionValidInDb(request, (err, response) => {
      if (err) {
        console.error('❌ CheckSessionInDB Error:', err.message);
      } else {
        console.log('✅ CheckSessionInDB Response:', response);
      }
      resolve();
    });
  });
}



function testIsEmailExistsInDb(email) {
  return new Promise((resolve) => {
    const request = { email };
    client.IsEmailExistsInDb(request, (err, response) => {
      if (err) {
        console.error('❌ IsEmailExistsDb Error:', err.message);
      } else {
        console.log('✅ IsEmailExistsDb Response:', response);
      }
      resolve();
    });
  }); 
}

(async () => {
  await testRegisterUser();
   await testLoginUser();
   
    const sampleSession = {
    sessionID: 'sess-00123',
    userUUID: 'uuid-abcde-999',
    userEmail: 'hytester123@example.com',
    userName: 'HY Tester'
  };

  async function runTests() {
    await testStoreSessionToDB(sampleSession);
    await testCheckSessionInDB(sampleSession.sessionID);
  }

  runTests();

  await testIsEmailExistsInDb(testUser.email);
})();
