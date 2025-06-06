// src/RedisClient.ts

import { createClient, RedisClientType } from 'redis';

export class RedisClient {
    private static instance: RedisClientType;  // <-- FIXED

    static async init(): Promise<void> {
        if (!RedisClient.instance) {
            const client = createClient({
                url: 'redis://localhost:6379',
            }) as RedisClientType;

            client.on('error', (err) => console.error('Redis Error:', err));
            await client.connect();

            console.log('✅ Redis connected');
            RedisClient.instance = client; 
        }
    }

    static getClient(): RedisClientType {
        if (!RedisClient.instance) throw new Error('Redis not initialized');
        return RedisClient.instance;
    }
}
