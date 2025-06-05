import { User } from "../Models/User";
import { Result } from '../../../shared-types/dist/common';// need npm install shared-types
import { UserRepository } from "../Repositories/UserRepository";

export class UserManager {
    public static async registerUser(user: User): Promise<Result<User>> {
        // Validate user data here if needed
        if (!user.email || !user.password) {
            return {
                success: false,
                data: undefined,
                message: "Email and password are required"
            };
        }
        return await UserRepository.UserRegister(user);
    }

    public static async loginUser(email: string, password: string): Promise<Result<User>> {
        // Validate email and password here if needed
        if (!email || !password) {
            return {
                success: false,
                data: undefined,
                message: "Email and password are required"
            };
        }
        return await UserRepository.UserLogin(email, password);
    }
}