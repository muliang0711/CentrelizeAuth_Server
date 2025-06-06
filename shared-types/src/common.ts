export type Result<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

export interface SessionData {
    sessionID: string;  
    userUUID: string;
    userEmail: string;
    userName: string;
}

export interface SessionData1111 {
    sessionID: string;  
    userUUID: string;
    userEmail: string;
    userName: string;
}

