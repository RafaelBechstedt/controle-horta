import express from 'express';
import plantRouter from './route/plantRoute.js';

const app = express();
const PORT = 3001;

app.use(express.json());

app.use('/api', plantRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});