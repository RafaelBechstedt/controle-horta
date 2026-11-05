import { prisma } from '../lib/prisma.js';

// Every query is scoped by userId so a user only ever sees or writes their own
// data (Model A tenant isolation enforced here, at the data layer).
export const getAllPlantsModel = (userId) =>
    prisma.plant.findMany({ where: { userId }, orderBy: { id: 'asc' } });

export const addPlantModel = ({ userId, name, plantedDate, observations }) =>
    prisma.plant.create({ data: { userId, name, plantedDate, observations } });
