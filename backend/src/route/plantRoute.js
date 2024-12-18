import express from 'express';
import { addPlantController, getAllPlantsController } from '../controller/plantController.js';

const plantRouter = express.Router();

plantRouter.get('/', getAllPlantsController)
plantRouter.post('/', addPlantController)

export default plantRouter;