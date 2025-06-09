import Redis from 'ioredis';
import { SessionData } from '@myfirstpackage/shared-types';

export class RedisManager {
    private static client: Redis | null = null;

    /**
     * Initialize the Redis client with host and port.
     */
    public static async init(REDIS_NAME: string, REDIS_PORT: string): Promise<void> {
        if (!RedisManager.client) {
            RedisManager.client = new Redis({
                host: REDIS_NAME,
                port: parseInt(REDIS_PORT, 10)
            });

            RedisManager.client.on('connect', () => {
                console.log('✅ Redis connected');
            });

            RedisManager.client.on('error', (err) => {
                console.error('❌ Redis error:', err);
            });
        }
    }

    /**
     * Return Redis client singleton instance.
     */
    public static getClient(): Redis {
        if (!RedisManager.client) {
            throw new Error('Redis not initialized');
        }
        return RedisManager.client;
    }

    /**
     * Store session data in Redis as a hash, with TTL (expiration in seconds).
     */
    public static async setSessionDataAsHash(sessionId: string, sessionData: SessionData, ttlSeconds: number): Promise<void> {
        await RedisManager.getClient().hset(`session:${sessionId}`, {
            sessionID: sessionData.sessionID,
            userUUID: sessionData.userUUID,
            userEmail: sessionData.userEmail,
            userName: sessionData.userName
        });
        await RedisManager.getClient().expire(`session:${sessionId}`, ttlSeconds);
    }

    /**
     * Retrieve session data from Redis by session ID.
     */
    public static async getSessionData(sessionId: string): Promise<SessionData | null> {
        const sessionData = await RedisManager.getClient().hgetall(`session:${sessionId}`);
        if (sessionData && Object.keys(sessionData).length > 0) {
            return {
                sessionID: sessionData.sessionID,
                userUUID: sessionData.userUUID,
                userEmail: sessionData.userEmail,
                userName: sessionData.userName
            };
        }
        return null;
    }

    /**
     * Delete session data by Redis key.
     * Returns the number of keys deleted (0 or 1).
     */
    public static async deleteSessionData(key: string): Promise<number> {
        return await RedisManager.getClient().del(key);
    }
}
