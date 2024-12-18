import mysql from 'mysql2/promise';

export const dbPool = mysql.createPool({
    host: 'database',
    user: 'root',
    password: 'password',
    database: 'garden_control',
});