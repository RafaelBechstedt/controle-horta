import { getAllPlantsModel, addPlantModel } from '../model/plantModel.js';

export const getAllPlantsService = (userId) => getAllPlantsModel(userId);

export const addPlantService = (plantData) => addPlantModel(plantData);
