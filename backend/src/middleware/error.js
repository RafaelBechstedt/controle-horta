import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

// Central error handler: maps known error types to clean JSON responses and
// hides internals on anything unexpected.
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        return res.status(err.status).json({ error: err.message });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }

    // Prisma unique-constraint violation (e.g. duplicate email on a race)
    if (err?.code === 'P2002') {
        return res.status(409).json({ error: 'Resource already exists' });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
};
