import { getAllPlantsService } from "../service/plantService.js";

export const getAllPlants = async (req, res) => {
    try {
        const plants = await getAllPlantsService();
        return res.status(200).json(plants);
    } catch (error) {
        return res.status(500).json(error)
    }
}