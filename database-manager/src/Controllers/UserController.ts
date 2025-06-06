import { UserService } from '../Services/UserService';
import { User } from '../Models/User';
import { UserRepository } from '../Repositories/UserRepository';
import { Result } from 'shared-types'; // Ensure shared-types is installed

export class UserController {

    public static async RegisterUser(call: any, callback: any) {

        //1 . Fetch user data from the request
        const { userName, email, password } = call.request;
        // console.log('✅ [DEBUG] RegisterUser called with:', { userName, email, password });
        // 2. Start validation checks :

        // 2.1 Email duplicate check :
        const emailExists = await UserService.checkEmailExists(email);
        if (emailExists) {
            return callback(null, { success: false, message: 'Email already exists' });
        }

        // ⛔️ 2.2 Password strength check :
        if (!UserService.validatePasswordStrength(password)) {
            return callback(null, { success: false, message: 'Password too weak' });
        }

        // ✅ 3. All validations passed, insert user
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

        // 2. Validate user credentials
        // pending -----
        const emailExists = await UserService.checkEmailExists(email);
        if (!emailExists) {
            return callback(null, { success: false, message: 'Email not found' });
        }
        // 3. all validations passed, call UserRepository to login user
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
};