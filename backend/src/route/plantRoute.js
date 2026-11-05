import express from 'express';
import { addPlantController, getAllPlantsController } from '../controller/plantController.js';
import { authenticate } from '../middleware/auth.js';

const plantRouter = express.Router();

// All plant routes require authentication and are scoped to the logged-in user.
plantRouter.use(authenticate);

plantRouter.get('/', getAllPlantsController);
plantRouter.post('/', addPlantController);

export default plantRouter;
