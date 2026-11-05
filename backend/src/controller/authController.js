import { z } from 'zod';
import { registerService, loginService } from '../service/authService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerController = asyncHandler(async (req, res) => {
    const data = credentialsSchema.parse(req.body);
    const result = await registerService(data);
    return res.status(201).json(result);
});

export const loginController = asyncHandler(async (req, res) => {
    const data = credentialsSchema.parse(req.body);
    const result = await loginService(data);
    return res.status(200).json(result);
});
