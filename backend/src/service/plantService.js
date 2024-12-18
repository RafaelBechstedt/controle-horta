import { getAllPlantsModel } from "../model/plantModel.js";

export const getAllPlantsService = async () => {
    const plants = await getAllPlantsModel();
    return plants;
}