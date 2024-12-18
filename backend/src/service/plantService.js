import { getAllPlantsModel, addPlantModel } from "../model/plantModel.js";

export const getAllPlantsService = async () => {
    const plants = await getAllPlantsModel();
    return plants;
}

export const addPlantService = async (plantData) => {
    const plantId = await addPlantModel(plantData);
    return plantId;
};