// ✅ Repositories/UserRepository.ts
import { User } from "../Models/User";
import { Result } from '../../../shared-types';// need npm install shared-types
import { MySQLManager } from '../../../database-manager/dist/dbManager';

export class UserRepository {
    public static async UserRegister(user: User): Promise<Result<User>> {
        try {
            const sql = 'INSERT INTO all_users (uuid, userName, email, password, created_at) VALUES (?, ?, ?, ?, ?)';
            const [result] = await MySQLManager.getPool().execute(sql, [
                user.uuid,
                user.userName,
                user.email,
                user.password,
                user.createdAt,
            ]);
            console.log('✅ [DEBUG] User registered:', user);
            return {
                success: true,
                data: user,
                message: "User registered successfully"
            };
        } catch (error) {
            return {
                success: false,
                data: undefined,
                message: "Error registering user: " + error
            };
        }
    }

    public static async UserLogin(email: string, password: string): Promise<Result<User>> {
        try {
            const sql = 'SELECT uuid, userName, email, password FROM all_users WHERE email = ? AND password = ?';
            const [rows]: any = await MySQLManager.getPool().execute(sql, [email, password]);

            if (!Array.isArray(rows) || rows.length === 0) {
                return {
                    success: false,
                    data: undefined,
                    message: "Invalid email or password"
                };
            }

            const user = User.fromJSON(rows[0]);
            console.log('✅ [DEBUG] User found:', user);
            return {
                success: true,
                data: user,
                message: "User logged in successfully"
            };
        } catch (error) {
            return {
                success: false,
                data: undefined,
                message: "Error logging in user: " + error
            };
        }
    }
}