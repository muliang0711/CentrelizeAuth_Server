import { User } from "../Models/User";
import { Result } from 'shared-types';
import { UserRepository } from "../Repositories/UserRepository";

export class UserService {

    public static async checkEmailExists(email: string): Promise<boolean> {
        const result = await UserRepository.findUserByEmail(email);
        return result.success && !!result.data;
    }

    public static validatePasswordStrength(password: string): boolean {
        return password.length >= 8; 
    }

    public static validateUserName(userName: string): boolean {
        return /^[a-zA-Z0-9_]{3,20}$/.test(userName);
    }

}