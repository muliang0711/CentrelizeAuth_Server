import { UserService } from '../Services/UserService';
import { User } from '../Models/User';
import { UserRepository } from '../Repositories/UserRepository';

export class UserController {

    public static async RegisterUser(call: any, callback: any) {

        //1 . Fetch user data from the request
        const { userName, email, password } = call.request;

        const newUser = new User('', userName, email, password);
        const result = await UserRepository.UserRegister(newUser);

        if (result.success) {
            callback(null, {
                success: true,
                message: result.message,
                uuid: result.data?.uuid,
                userName: result.data?.userName,
                email: result.data?.email
            });
        } else {
            callback(null, { success: false, message: result.message });
        }
    }

    public static async LoginUser(call: any, callback: any) {
        // 1. Extract email and password from the request
        const { email, password } = call.request;

        const result = await UserRepository.UserLogin(email, password);

        if (result.success) {
            callback(null, {
                success: true,
                message: result.message,
                uuid: result.data?.uuid,
                userName: result.data?.userName,
                email: result.data?.email
            });
        } else {
            callback(null, { success: false, message: result.message });
        }
    }


    public static async IsEmailExistsInDb(call: any, callback: any) {
        const { email } = call.request;

        const result = await UserService.checkEmailExists(email);

        if (!result.success) {
            return callback(null, {
                success: false,
                message: result.message || 'Unknown error'
            });
        }

        if (result.data === true && result.success) {
            return callback(null, {
                success: true,
                message: 'Email exists'
            });
        } else {
            return callback(null, {
                success: false,
                message: 'Email does not exist'
            });
        }
    }

    public static async StoreSessionDataToDb(call: any, callback: any) {
        const { sessionData } = call.request;

        console.log("🟡 [DEBUG] StoreSessionDataToDb called");
        console.log("📥 sessionData:", sessionData);
        console.log("📥 sessionData typeof:", typeof sessionData);
        console.log("📥 sessionData value:", sessionData);

        const result = await UserRepository.storeSessionData(sessionData);

        return callback(null, {
            success: result.success,
            sessionData: result.data || null,
            message: result.message || "Unknown error",
        });
    }


public static async CheckSessionInDb(call: any, callback: any) {
    const { sessionID } = call.request;

    console.log("🟡 [DEBUG] CheckSessionInDb called");
    console.log("🔍 sessionID:", sessionID);

    const result = await UserRepository.getSessionData(sessionID);

    return callback(null, {
        success: result.success,
        sessionData: result.data || null,
        message: result.message || "Session not found"
    });
}




}