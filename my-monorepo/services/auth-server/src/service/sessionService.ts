// services/SessionManager.ts
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { Result } from '@myfirstpackage/shared-types';// need npm install shared-types
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

        return sessionData;
    }


}