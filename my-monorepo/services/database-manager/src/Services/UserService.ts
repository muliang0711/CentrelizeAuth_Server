import { User } from '@myfirstpackage/shared-types';
import { Result } from '@myfirstpackage/shared-types';
import { UserRepository } from "../Repositories/UserRepository";

export class UserService {


public static async checkEmailExists(email: string): Promise<Result<boolean>> {
    return await UserRepository.checkEmailExists(email);
}


}