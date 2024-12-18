import { getAllPlantsService, addPlantService } from "../service/plantService.js";

export const getAllPlantsController = async (_req, res) => {
    try {
        const plants = await getAllPlantsService();
        return res.status(200).json(plants);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export const addPlantController = async (req, res) => {
    const { name, planted_date, observations } = req.body;

    if (!name || !planted_date) {
        return res.status(400).json({ error: "Fields 'name' and 'planted_date' are required." });
    }

    // Campos opcionais tratados como null, se ausentes
    const plantData = {
        name,
        planted_date,
        observations: observations || null
    };

    try {
        const newPlant = await addPlantService(plantData);
        return res.status(201).json({ newPlant, message: "Plant was successfully added" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};