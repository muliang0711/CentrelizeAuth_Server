
import { User } from '../../../database-manager/src/Models/User';
import { UserManager } from '../../../database-manager/src/Services/UserService';
import { Result } from 'shared-types';
import { tokenManager} from '../service/jwtService';
import { SessionManager } from '../service/sessionService';
export class UserController {

    public static async RegisterUser(call : any , callback :any ){
        const {name , email , password} = call.request;
        const user = new User('', name, email, password);
        // make a grpc call to UserManager to register the user
        const result: Result<User> = await UserManager.registerUser(user);
        if (result.success) {
            const user = result.data ? User.toJSON(result.data) : null;
            callback(null, { 
                success: true,
                message: result.message,
                uuid: user ? user.uuid : null, 
                userName: user ? user.userName : null,
                email: user ? user.email : null,
            });
        } else {
            callback({ 
                code: 500,
                message: result.message 
            });
        }
    } 

    public static async LoginUser(call : any , callback : any){
        // 1. Extract email and password from the request
        const {email , password} = call.request;
        // 2. if email or password is not provided, return an error
        if (!email || !password) {
            return callback({ 
                code: 400,
                message: 'Email and password are required' 
            });
        }
        // 3. Call the UserManager to login the user
        const result: Result<User> = await UserManager.loginUser(email, password);
        // 4. If the login is successful, generate a session and return the session data
        if (result.success) {                                                                                               
            
            // console.log('Login Result:', result);
            
            const user = result.data ? User.toJSON(result.data) : null;
            const sessionData = await SessionManager.generateSession(user.uuid, user.email, user.userName);
            const token = tokenManager.generateToken({ uuid: user.uuid, email: user.email , name: user.userName }); // Generate JWT token
            // console.log('Session Data:', sessionData);
            // console.log('User Data:', user);

            callback(null, { 
                success: true,
                message: result.message,
                token,
                session: {
                    sessionId: sessionData.sessionID,
                    userId: sessionData.userUUID, // user.getUserId(user)
                    userEmail: sessionData.userEmail,
                    userName: sessionData.userName
                }

            });
        } else {
            callback({ 
                code: 500,
                message: result.message 
            });
        }
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

        // 4. If the token is valid, generate a session and return the session data
        if (result.valid && result.payload) {
            // console.log('Token Payload:', result.payload);

            // 5. TRY TO FETCH SESSION DATA FROM REDIS
            const RESULT = await SessionManager.sessionValidation(result.payload.uuid);
            const sessionData = RESULT.data;
            
            // to avoid session data being null
            if(!sessionData) {
                return callback({
                    code: 401,
                    message: 'SessionDATA not found or expired'
                });
            }
            
            // console.log('Session Validation Result:', sessionData);
            // console.log('Session Data:', sessionData);

            // 6. Return the session data in the callback
            callback(null, { 
                success: true,
                message: 'Token is valid',
                session: {
                    sessionId: sessionData.sessionID,
                    userId: sessionData.userUUID, // user.getUserId(user)
                    userEmail: sessionData.userEmail,
                    userName: sessionData.userName
                }

            });
        } else {
            callback({ 
                code: 401,
                message: result.message 
            });
        }
    }

}

