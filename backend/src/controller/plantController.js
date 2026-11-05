import { z } from 'zod';
import { getAllPlantsService, addPlantService } from '../service/plantService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const createPlantSchema = z.object({
    name: z.string().min(1),
    planted_date: z.coerce.date(),
    observations: z.string().nullish(),
});

export const getAllPlantsController = asyncHandler(async (req, res) => {
    const plants = await getAllPlantsService(req.userId);
    return res.status(200).json(plants);
});

export const addPlantController = asyncHandler(async (req, res) => {
    const { name, planted_date, observations } = createPlantSchema.parse(req.body);

    const plant = await addPlantService({
        userId: req.userId,
        name,
        plantedDate: planted_date,
        observations: observations ?? null,
    });

    return res.status(201).json(plant);
});
