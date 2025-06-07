// 1. This file is jwtService.ts
import jwt from 'jsonwebtoken';


const JWT_SECRET =  'defaultSecret';
const JWT_EXPIRY = '30d'; // Token expiry time same as session expiry time

interface JwtPayload {
  uuid: string;
  email: string;
  name: string; // Optional field for user name
}
export class tokenManager {
  // Function to generate a JWT
  public static generateToken(payload: JwtPayload): string {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return token;
  }

  // Function to verify a JWT
  public static verifyToken(token: string): { valid: boolean; payload?: JwtPayload; message?: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      return { valid: true, payload: decoded, message: 'Token is valid' };
      
    } catch (err) {

      return { valid: false, message: 'Invalid or expired token' + err };
    }
  }

}
