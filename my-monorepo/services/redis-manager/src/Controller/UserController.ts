// src/controller/SessionRedisController.ts

import { RedisManager } from '../redisManager';
import { SessionData } from '@myfirstpackage/shared-types';

export class SessionRedisController {


    public static async StoreSessionToRedis(call: any, callback: any) {
        try {
            const { sessionData , exptime } = call.request;

            if (!sessionData?.sessionID) {
                return callback(null, { success: false, message: 'Session ID is required' });
            }

            const redisKey = `session:${sessionData.sessionID}`;
            await RedisManager.setSessionDataAsHash(redisKey, sessionData, exptime);
 
            return callback(null, {
                success: true , 
                sessionData,
                validtime: exptime 
            });

        } catch (err) {
            console.error('❌ Error in StoreSessionToRedis:', err);
            return callback(err, null);
        }
    }

    public static async CheckSessionInRedis(call: {request : {sessionID : string } }, callback: any) {
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

    public static async DeleteSessionDataInRedisById(
        call: {request :{ sessionID: string }}, 
        callback: (error: any | null, response?: { success: boolean; message: string }) => void ){
        try {
            const { sessionID } = call.request ;
            const redisKey =   `session:${sessionID}`;

            const deleteResult = await RedisManager.deleteSessionData(redisKey);

            if(deleteResult === 0 ){
                return callback(null , {
                    success : false ,
                    message : `NO session found for ID ${sessionID}`
                });
            }
            return callback(null, {
                success: true,
                message: `Session with ID ${sessionID} deleted successfully`
            });
        } catch (err) {
            console.error('❌ Error in DeleteSessionDataInRedisById:', err);
            return callback(err , {
                success : false ,
                message : "Delete Session failed " + err  
            });
        }
    }  

};
