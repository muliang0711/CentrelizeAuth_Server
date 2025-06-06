// 1. a function that store the session id as key and session data as value in redis
import Redis from 'ioredis';
import { SessionData } from 'shared-types';

export class RedisManager {

    // Call this once during app startup
    private static client: Redis | null = null;

    // 初始化 Redis
    public static async init(): Promise<void> {
        if (!RedisManager.client) {
            RedisManager.client = new Redis({
                host: 'localhost',
                port: 6379,
            });

            RedisManager.client.on('connect', () => {
                console.log('✅ Redis connected');
            });

            RedisManager.client.on('error', (err) => {
                console.error('❌ Redis error:', err);
            });
        }
    }

    public static getClient(): Redis {
        if (!RedisManager.client) {
            throw new Error('Redis not initialized');
        }
        return RedisManager.client;
    }

    //public static async setSessionDataAsString(sessionId: string, sessionData: any, ttlSeconds: number): Promise<void> {
    //   await this.redis.setex(sessionId, ttlSeconds, JSON.stringify(sessionData));
    // } // not more used

    // Function that set the session data in Redis with a hash :
    public static async setSessionDataAsHash(sessionId: string, sessionData: SessionData, ttlSeconds: number): Promise<void> {
        await RedisManager.getClient().hset(`session:${sessionId}`, {
            sessionID: sessionData.sessionID,
            userUUID: sessionData.userUUID,
            userEmail: sessionData.userEmail,
            userName: sessionData.userName
        });
        await RedisManager.getClient().expire(`session:${sessionId}`, ttlSeconds);
    }

    // Function to get session data from Redis by sessionId
    public static async getSessionData(sessionId: string): Promise<SessionData | null> {
        const sessionData = await RedisManager.getClient().hgetall(`session:${sessionId}`);
        if (sessionData && Object.keys(sessionData).length > 0) {
            // Map the string values to SessionData type
            return {
                sessionID: sessionData.sessionID,
                userUUID: sessionData.userUUID,
                userEmail: sessionData.userEmail,
                userName: sessionData.userName
            } as SessionData;
        }
        return null;
    }
    public static async deleteSessionData(key: string): Promise<number> {
        return await RedisManager.getClient().del(key) // return a number that success del how many key 
    }

    

}