import { dbPool } from "./connection.js";

export const getAllPlantsModel = async () => {
    const [rows] = await dbPool.execute('SELECT * FROM plants');
    return rows;
};

export const addPlantModel = async (plantData) => {
    const { name, planted_date, observations } = plantData;
    const query = `
        INSERT INTO plants (name, planted_date, observations)
        VALUES (?, ?, ?)
    `;
    const [result] = await dbPool.execute(query, [name, planted_date, observations]);
    return result.insertId;
};