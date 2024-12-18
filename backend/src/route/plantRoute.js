import express from 'express';
import { getAllPlants } from '../controller/plantController.js';

const plantRouter = express.Router();

plantRouter.get('/', getAllPlants)

export default plantRouter;