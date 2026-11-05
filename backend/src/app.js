import express from 'express';
import cors from 'cors';
import plantRouter from './route/plantRoute.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:8080' }));
app.use(express.json());

app.use('/api', plantRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
