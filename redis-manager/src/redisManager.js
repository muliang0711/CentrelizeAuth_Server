"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
// 1. a function that store the session id as key and session data as value in redis
const ioredis_1 = __importDefault(require("ioredis"));
class RedisManager {
    // Call this once during app startup
    static async initializeRedis() {
        await this.redis.config('SET', 'maxmemory', '100mb'); // SET maxmemory used to 100mb
        await this.redis.config('SET', 'maxmemory-policy', 'allkeys-lru'); // Set maxmemory-policy to allkeys-lru
        console.log('✅ Redis LRU configuration applied');
    }
    // Function that set the sesssion data in Redis in string format :
    static async setSessionDataAsString(sessionId, sessionData, ttlSeconds) {
        await this.redis.setex(sessionId, ttlSeconds, JSON.stringify(sessionData));
    } // not more used
    // Function that set the session data in Redis with a hash :
    static async setSessionDataAsHash(sessionId, sessionData, ttlSeconds) {
        await this.redis.hset(`session:${sessionId}`, {
            sessionID: sessionData.sessionID,
            userUUID: sessionData.userUUID,
            userEmail: sessionData.userEmail,
            userName: sessionData.userName
        });
        await this.redis.expire(`session:${sessionId}`, ttlSeconds);
    }
    // Function to get session data from Redis by sessionId
    static async getSessionData(sessionId) {
        const sessionData = await this.redis.hgetall(`session:${sessionId}`);
        if (sessionData && Object.keys(sessionData).length > 0) {
            // Map the string values to SessionData type
            return {
                sessionID: sessionData.sessionID,
                userUUID: sessionData.userUUID,
                userEmail: sessionData.userEmail,
                userName: sessionData.userName
            };
        }
        return null;
    }
}
exports.RedisManager = RedisManager;
_a = RedisManager;
RedisManager.redisHost = 'localhost';
RedisManager.redisPort = 6379;
RedisManager.redis = new ioredis_1.default({
    host: _a.redisHost,
    port: _a.redisPort,
});
