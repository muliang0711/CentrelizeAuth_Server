import { User } from "../Models/User";
import { Result } from 'shared-types';
import { UserRepository } from "../Repositories/UserRepository";

export class UserService {


public static async checkEmailExists(email: string): Promise<Result<boolean>> {
    return await UserRepository.checkEmailExists(email);
}


}