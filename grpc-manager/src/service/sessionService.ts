// services/SessionManager.ts
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { MySQLManager } from '../../../database-manager/dist/dbManager';
import { Result } from '../../../shared-types/dist/common';// need npm install shared-types
import { RedisManager } from '../../../redis-manager/dist/redisManager';
export interface SessionData {
    sessionID: string;
    userUUID: string;
    userEmail: string;
    userName: string;
}

export class SessionManager {

    public static async generateSession(
        userUUID: string,
        userEmail: string,
        userName: string,
    ): Promise<SessionData> {
        const random = uuidv4();
        const timestamp = Date.now().toString();

        const sessionID = crypto
            .createHash('sha256')
            .update(userUUID + timestamp + random)
            .digest('hex');

        const sessionData: SessionData = {
            sessionID,
            userUUID,
            userEmail,
            userName,
        };

        // session exp Time : 
        const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

        // 1. SAVE INSIDE THE DB AND THAN REDIS 
        // 1. SAVE TO MYSQL
        await MySQLManager.getPool().query(
            'INSERT INTO sessions (sessionId, userId, sessionData, expiresAt) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))',
            [sessionID, userUUID, JSON.stringify(sessionData), SESSION_TTL_SECONDS]
        );
        // 2. SAVE TO REDIS
        await RedisManager.setSessionDataAsHash(sessionID, sessionData, SESSION_TTL_SECONDS);

        // await redis.setex(sectionID, SESSION_TTL_SECONDS, JSON.stringify(sessionData));
        // redis.setex(...) is a Redis command to set a key with an expiration time
        // sectionID: This is the key (like an ID or token)
        // SESSION_TTL_SECONDS: Expiry time in seconds (e.g. 3600 = 1 hour)
        // JSON.stringify(sessionData): Converts the session data object into a JSON string to store it in Redis
        return sessionData;
    }

    // 2. SESSIONID validation
    // session is not in reids than check in the db -> value it > 30day ? invalid : valid if invalid lets user login again ;
    public static async sessionValidation(sessionId: string): Promise<Result<SessionData>> {
        try {
            // 1. Check Redis for fast access
            const sessionData = await RedisManager.getSessionData(sessionId);
            if (sessionData) {
                return {
                    success: true,
                    data: sessionData,
                };
            }

            // 2. Fallback to MySQL
            const result = await MySQLManager.getPool().query(
                'SELECT sessionData, expiresAt FROM sessions WHERE sessionId = ? AND expiresAt > NOW()',
                [sessionId]
            );
            const rows = result[0] as { sessionData: string; expiresAt: string }[];

            if (rows.length > 0) {
                const data = JSON.parse(rows[0].sessionData); // turns the sessionData string back to an object
                // Calculate TTL in seconds
                // Convert expiresAt to milliseconds and calculate TTL
                const expiresAt = new Date(rows[0].expiresAt).getTime();
                const now = Date.now();
                const ttlSeconds = Math.floor((expiresAt - now) / 1000);
                // Optional: Write back to Redis for caching
                if (ttlSeconds > 0) {
                    await RedisManager.setSessionDataAsHash(sessionId, data, ttlSeconds);
                    return {
                        success: true,
                        data,
                    };
                }

            }

            // 3. Session is invalid
            return {
                success: false,
                message: 'Session is invalid or expired',
            };
        } catch (error: any) {
            // 4. Error handling
            return {
                success: false,
                message: 'Internal server error during session validation',
                data: undefined,
            };
        }
    }


}