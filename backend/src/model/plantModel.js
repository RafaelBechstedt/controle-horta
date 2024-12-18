import { dbPool } from "./connection.js";

export const getAllPlantsModel = async () => {
    const [rows] = await dbPool.execute('SELECT * FROM plants');
    return rows;
};