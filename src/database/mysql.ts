import mysql from 'mysql';
import "dotenv/config";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// Error codes returned by 
export enum ErrorCodes {
    DUPLICATE_ENTRY = 'ER_DUP_ENTRY',
}

export default connection;