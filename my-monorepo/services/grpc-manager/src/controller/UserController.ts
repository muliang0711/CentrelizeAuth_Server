import { User, Result, SessionData } from '@myfirstpackage/shared-types';
import { tokenManager } from '../service/jwtService';
import { SessionManager } from '../service/sessionService';
import { dbClient } from "../grpc/dbClient";
import redisClient from "../grpc/rdClient";

export class MainServerController {

    public static async RegisterUser(call: any, callback: any) {
        const { userName, email, password } = call.request;

        // 1. Step 1 - Check if email exists
        dbClient.IsEmailExistsInDb({ email }, (err: any, res: any) => {
            if (err) {
                console.error('❌ gRPC DB error during email check:', err.message);
                return callback(null, {
                    success: false,
                    message: 'Internal server error from DB (email check)'
                });
            }

            if (res.success) {
                // Email already exists
                return callback(null, {
                    success: false,
                    message: 'Email already exists'
                });
            }

            // 2. Step 2 - Email does not exist, proceed to register
            dbClient.RegisterUserDb({ userName, email, password }, (err: any, res: any) => {
                if (err) {
                    console.error('❌ gRPC DB error during registration:', err.message);
                    return callback(null, {
                        success: false,
                        message: 'Internal server error from DB (registration)'
                    });
                }

                if (res.success) {
                    return callback(null, {
                        success: true,
                        message: res.message,
                        uuid: res.uuid, // maybe not need to return uuid 
                        userName: res.userName,
                        email: res.email
                    });
                } else {
                    return callback(null, {
                        success: false,
                        message: res.message
                    });
                }
            });
        });
    }

    public static async LoginUser(call: any, callback: any) {
        const { email, password } = call.request;

        // 1. Validate input
        if (!email || !password) {
            return callback({
                code: 400,
                message: 'Email and password are required'
            });
        }

        // 2. gRPC call to verify login credentials
        dbClient.LoginUserDb({ email, password }, async (err: any, res: any) => {
            if (err || !res.success) {
                console.error('❌ gRPC DB login error:', err?.message || res.message);
                return callback(null, {
                    success: false,
                    message: res?.message || 'Internal server error'
                });
            }

            // 3. Generate JWT token
            const token = tokenManager.generateToken({
                uuid: res.uuid,
                email: res.email,
                name: res.userName
            });
                    console.log(token);

            // 4. Create session data object
            const sessionData = await SessionManager.generateSession(res.uuid, res.email, res.userName);

            // 5. Save session to DB via gRPC
            dbClient.StoreSessionDataToDb({ sessionData }, (errDb: any, dbRes: any) => {
                if (errDb || !dbRes.success) {
                    console.error('❌ Failed to store session in DB:', errDb?.message || dbRes?.message);
                    return callback(null, {
                        success: false,
                        message: 'Login successful, but failed to store session in DB'
                    });
                }

                // 6. Save session to Redis via gRPC
                const exptime = 60 * 60 * 24 * 30; // 30 days

                redisClient.StoreSessionDataToRedis({ sessionData, exptime }, (errRedis: any, redisRes: any) => {
                    if (errRedis || !redisRes.success) {
                        console.error('❌ Failed to store session in Redis:', errRedis?.message || redisRes?.message);
                        return callback(null, {
                            success: false,
                            message: 'Login successful, but failed to store session in Redis'
                        });
                    }

                    // 7. Return full success response
                    return callback(null, {
                        success: true,
                        message: 'Login successful',
                        token,
                        sessionData: redisRes.sessionData
                    });
                });
            });
        });
    }

    public static async LoginWithToken(call: any, callback: any) {
        // 1. Extract the token from the request
        const { token } = call.request;

        // 2. if token is not provided, return an error
        if (!token) {
            return callback({
                code: 400,
                message: 'Token is required'
            });
        }
        // 3. Verify the token using the tokenManager return an object with valid and payload
        const result = tokenManager.verifyToken(token);

        // 4. If the token is valid, check the sessionID : 
        if (result.valid && result.payload) {

            callback(null, {
                success: true,
                message: 'Token is valid',

            });
        } else {
            callback({
                success : false , 
                message: result.message
            });
        }
    }
    public static async CheckSessionValid(call: any, callback: any) {
        const { sessionID } = call.request ;

        if (!sessionID) {
            return callback(null, {
                success: false,
                message: '❌ Session ID is required',
            });
        }

        // Step 1: Check Redis
        redisClient.CheckSessionDataInRedis({ sessionID }, (err: any, redisRes: any) => {
            if (err) {
                console.error('❌ Redis Error:', err);
                return callback(null, {
                    success: false,
                    message: 'Internal error while checking Redis'
                });
            }

            if (redisRes && redisRes.success) {
                return callback(null, {
                    success: true,
                    message: '✅ Session found in Redis',
                    sessionData: redisRes.sessionData
                });
            }

            // Step 2: Check DB
            dbClient.CheckSessionValidInDb({ sessionID } ,(err: any, dbRes: any) => {
                if (err) {
                    console.error('❌ DB Error:', err);
                    return callback(null, {
                        success: false,
                        message: 'Internal error while checking DB'
                    });
                }

                if (dbRes && dbRes.success) {
                    return callback(null, {
                        success: true,
                        message: '✅ Session found in DB',
                        sessionData: dbRes.sessionData
                    });
                }

                // Final fail
                return callback(null, {
                    success: false,
                    message: '❌ Session not found in Redis or DB',
                });
            });
        });
    }
}

