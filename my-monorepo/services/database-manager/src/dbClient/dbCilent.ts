// database-manager/src/dbManager.ts
import * as mysql from 'mysql2/promise';
require('dotenv').config();
import {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} from '../config';

export class MySQLClient {
    private static pool: mysql.Pool;

    public static async initialize(): Promise<void> {
        this.pool = mysql.createPool({
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: MYSQL_DATABASE,
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
