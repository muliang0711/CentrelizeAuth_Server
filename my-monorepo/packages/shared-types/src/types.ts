// 通用 Result 类型
export type Result<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

// 会话信息结构
export interface SessionData {
  sessionID: string;
  userUUID: string;
  userEmail: string;
  userName: string;
}
