// src/db/MySQLManager.ts
import * as mysql from 'mysql2/promise';

export class MySQLClient {
    private static pool: mysql.Pool;

    public static async initialize(): Promise<void> {
        this.pool = mysql.createPool({
            host:  'localhost', // Use 'mysql' if running in Docker, or 'localhost' if running locally
            user:  'root',
            password:  '1234aaa0987',
            database:  'userServer',
            port:  3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        // 测试连接
        const conn = await this.pool.getConnection();
        await conn.ping();
        console.log('✅ MySQL pool connected');
        conn.release();
    }

    public static getPool(): mysql.Pool {
        return this.pool;
    }
}
