import express, { Express } from 'express';
import { initORM } from './orm.js';
import { authenticateUser } from './middleware/auth/auth.js';
import cors from './middleware/cors.js';
import { getLogger, Logger } from './logging/initalize.js';
import { responseTimeLogger } from './logging/responseTimeLogger.js';
import responseTime from 'response-time';
import { EnvVars, getNumericEnvVar } from './util/envvars.js';
import apiRouter from './routes/router.js';
import swaggerMiddleware from './swagger';
import swaggerUi from 'swagger-ui-express';

const logger: Logger = getLogger();

const app: Express = express();
const port: string | number = getNumericEnvVar(EnvVars.Port);

app.use(express.json());
app.use(cors);
app.use(authenticateUser);
// Add response time logging
app.use(responseTime(responseTimeLogger));

// Swagger
app.get('/api', apiRouter);

app.use('/api-docs', swaggerUi.serve, swaggerMiddleware);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}/api`);
    });
}

await startServer();
