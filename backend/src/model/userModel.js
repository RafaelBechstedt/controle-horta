import { prisma } from '../lib/prisma.js';

export const createUser = ({ email, passwordHash }) =>
    prisma.user.create({ data: { email, passwordHash } });

export const findUserByEmail = (email) =>
    prisma.user.findUnique({ where: { email } });
