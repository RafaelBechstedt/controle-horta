import { verifyToken } from '../lib/token.js';
import { AppError } from '../lib/errors.js';

// Requires a valid Bearer token and exposes the authenticated user id as
// req.userId, which the data layer uses to scope every query (tenant isolation).
export const authenticate = (req, _res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        throw new AppError(401, 'Missing or invalid Authorization header');
    }

    try {
        const payload = verifyToken(token);
        req.userId = Number(payload.sub);
    } catch {
        throw new AppError(401, 'Invalid or expired token');
    }

    next();
};
