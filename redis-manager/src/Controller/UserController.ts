// src/controller/SessionRedisController.ts

import { RedisManager } from '../redisManager';

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days in seconds

export class SessionRedisController {

    
    public static async StoreSessionToRedis(call: any, callback: any) {
        try {
            const { sessionData } = call.request;

            if (!sessionData?.sessionID) {
                return callback(null, { success: false, message: 'Session ID is required' });
            }

            const redisKey = `session:${sessionData.sessionID}`;
            await RedisManager.setSessionDataAsHash(redisKey, sessionData, TTL_SECONDS);

            return callback(null, {
                success: true,
                sessionData,
                validtime: TTL_SECONDS
            });

        } catch (err) {
            console.error('❌ Error in StoreSessionToRedis:', err);
            return callback(err, null);
        }
    }

    public static async CheckSessionInRedis(call: any, callback: any) {
        try {
            const { sessionID } = call.request;
            const redisKey = `session:${sessionID}`;
            const sessionData = await RedisManager.getSessionData(redisKey);

            if (!sessionData) {
                
                return callback(null, { success: false , message: 'Session not found' });
            }

            return callback(null, {
                success: true,
                sessionData,
                message: 'Session found successfully'
            });

        } catch (err) {
            console.error('❌ Error in CheckSessionInRedis:', err);
            return callback(err, null);
        }
    }
};
