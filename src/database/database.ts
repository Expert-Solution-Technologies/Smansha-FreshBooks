import * as mysql from 'mysql';
import app from '@server';


/**
 * Database class for connecting application to DB
 */
class Database {
    private static instance: any = null;
    private mysqlnativepool: mysql.Pool;

    constructor() {
        /** create Pool */
        const pool = mysql.createPool({
            connectionLimit: 30,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            charset: 'utf8mb4',
            dateStrings: ['DATE']
        });

        pool.on('error', (err: any) => {
            console.log('pool connection err >>>>>>' + err);
            process.exit(1);
        });

        this.mysqlnativepool = pool;
        app.set('DB', pool);
    }

    /**
     * Get DB Instance
     */
    public static async getDBInstance() {
        if (!Database.instance) {
            try {
                Database.instance = new Database();
            } catch (error) {
                console.log('DB Connection ERROR! ' + error);
                process.exit(1);
            }
        }

        return Database.instance;
    }

    /**
     * this will return the connection from pool
     */
    public getConnectionFromPool(): Promise<mysql.PoolConnection> {
        const self = this;
        return new Promise((resolve, reject) => {
            self.mysqlnativepool.getConnection((err: any, connection: any) => {
                if (err) {
                    return reject(err);
                }
                return resolve(connection);
            });
        });
    }

    /**
     * This will return the connection pool
     */
    public getConnectionPool() {
        return this.mysqlnativepool;
    }
}
export { Database };
