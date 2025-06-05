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