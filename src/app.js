import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const swaggerDoc = load(readFileSync('./src/swagger/swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/v1', routes);

app.use(errorHandler);

export default app;
