import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'garden_control',
};

export const connect = async () => {
    return await mysql.createConnection(dbConfig);
};