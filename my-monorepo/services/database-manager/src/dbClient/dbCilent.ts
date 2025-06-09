// database-manager/src/dbManager.ts
import * as mysql from 'mysql2/promise';
/**
 * MySQLClient is a singleton connection pool manager.
 */
export class MySQLClient {
    private static pool: mysql.Pool;

    /**

     * @param host MySQL server hostname
     * @param port MySQL server port
     * @param user MySQL username
     * @param password MySQL password
     * @param database Database name
     */
    public static async initialize(
        host: string,
        port: number,
        user: string,
        password: string,
        database: string
    ): Promise<void> {
        this.pool = mysql.createPool({
            host,
            port,
            user,
            password,
            database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        const conn = await this.pool.getConnection();
        await conn.ping();
        console.log('✅ MySQL pool connected');
        conn.release();
    }

    /**
     * Returns the MySQL connection pool.
     */
    public static getPool(): mysql.Pool {
        return this.pool;
    }
}
