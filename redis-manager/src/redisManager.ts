// 1. a function that store the session id as key and session data as value in redis
import Redis from 'ioredis';
import { SessionData } from 'shared-types';

export class RedisManager {
    private static redisHost = 'redis';
    private static redisPort = 6379;
    private static redis = new Redis({
        host: this.redisHost,
        port: this.redisPort,
    });

    // Call this once during app startup
    public static async initializeRedis(): Promise<void> {
        await this.redis.config('SET', 'maxmemory', '100mb'); // SET maxmemory used to 100mb
        await this.redis.config('SET', 'maxmemory-policy', 'allkeys-lru'); // Set maxmemory-policy to allkeys-lru
        console.log('✅ Redis LRU configuration applied');
    }

    // Function that set the sesssion data in Redis in string format :
    public static async setSessionDataAsString(sessionId: string, sessionData: any, ttlSeconds: number): Promise<void> {

        await this.redis.setex(sessionId, ttlSeconds, JSON.stringify(sessionData));
    } // not more used

    // Function that set the session data in Redis with a hash :
    public static async setSessionDataAsHash(sessionId: string, sessionData: SessionData, ttlSeconds: number): Promise<void> {
        await this.redis.hset(`session:${sessionId}`, {
            sessionID: sessionData.sessionID,
            userUUID: sessionData.userUUID,
            userEmail: sessionData.userEmail,
            userName: sessionData.userName
        });
        await this.redis.expire(`session:${sessionId}`, ttlSeconds);
    }

    // Function to get session data from Redis by sessionId
    public static async getSessionData(sessionId: string): Promise<SessionData | null> {
        const sessionData = await this.redis.hgetall(`session:${sessionId}`);
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

}