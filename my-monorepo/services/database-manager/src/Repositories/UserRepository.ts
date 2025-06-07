
import { User } from '@myfirstpackage/shared-types';
import { Result, SessionData } from '@myfirstpackage/shared-types';// need npm install shared-types
import { MySQLClient } from "../dbClient/dbCilent";
export class UserRepository {

    public static async UserRegister(user: User): Promise<Result<User>> {
        try {
            const sql = 'INSERT INTO all_users (uuid, userName, email, password, created_at) VALUES (?, ?, ?, ?, ?)';
            const [result] = await MySQLClient.getPool().execute(sql, [
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
            const [rows]: any = await MySQLClient.getPool().execute(sql, [email, password]);

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

    public static async checkEmailExists(email: string): Promise<Result<boolean>> {
        try {
            const sql = 'SELECT uuId FROM all_users WHERE email = ?';
            const [rows]: any = await MySQLClient.getPool().execute(sql, [email]);

            const exists = Array.isArray(rows) && rows.length > 0;

            console.log(exists);
            console.log('📩 Parameters:', [email]);
            console.log('🧪 Raw SQL Result:', rows);

            return {
                success: true,
                data: exists,
                message: exists
                    ? "User exists with this email."
                    : "User not found with this email."
            };
        } catch (error: any) {
            return {
                success: false,
                data: false,
                message: `Database error: ${error.message || 'Unknown error'}`
            };
        }
    }

    public static async storeSessionData(sessionData: SessionData): Promise<Result<SessionData>> {
        try {
            const sql = 'INSERT INTO sessions (sessionId , sessionData , createdAT , expiresAT ) VALUES (?, ? , ? , ? )';
            
            const createdAt = Date.now(); 
            const expiresAt = createdAt + 30 * 24 * 60 * 60 * 1000; 

            const [result]: any = await MySQLClient.getPool().execute(sql, [
                sessionData.sessionID,
                JSON.stringify(sessionData),
                createdAt,
                expiresAt
            ]);

            console.log('✅ [DEBUG] Session stored:', sessionData);

            if (result?.affectedRows > 0) {
                return {
                    success: true,
                    data: sessionData,
                    message: 'Session stored successfully',
                };
            }

            return {
                success: false,
                message: 'Insert operation did not affect any rows.',
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Error storing session data: ${error.message || error}`
            };
        }
    }

    public static async getSessionData(sessionID: string): Promise<Result<SessionData>> {
        try {
            const sql = 'SELECT sessionData FROM sessions WHERE sessionId = ?';
            const [rows]: any = await MySQLClient.getPool().execute(sql, [sessionID]);

            if (!Array.isArray(rows) || rows.length === 0) {
                return {
                    success: false,
                    message: "Session not found"
                };
            }

            const sessionData = rows[0].sessionData;
            console.log('✅ [DEBUG] Session found:', sessionData);
            console.log(sessionData);

            return {
                success: true,
                data: sessionData,
                message: "Session retrieved successfully"
            };

        } catch (error: any) {
            return {
                success: false, 
                message: `Error retrieving session data: ${error.message || error}`
            };
        }
    }


}
