import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import routes from './src/routes/index.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

const app = express();
app.use(express.json());

const swaggerDoc = load(readFileSync('./swagger/swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api/v1', routes);  // clean versioned prefix

app.use(errorHandler);

export default app;