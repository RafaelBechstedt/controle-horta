import express from 'express';
import cors from 'cors';
import authRouter from './route/authRoute.js';
import plantRouter from './route/plantRoute.js';
import { errorHandler } from './middleware/error.js';

for (const key of ['DATABASE_URL', 'JWT_SECRET']) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:8080' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/plants', plantRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
