import express, { Express } from 'express';
import { initORM } from './orm.js';
import { authenticateUser } from './middleware/auth/auth.js';
import cors from './middleware/cors.js';
import { getLogger, Logger } from './logging/initalize.js';
import { responseTimeLogger } from './logging/responseTimeLogger.js';
import responseTime from 'response-time';
import { envVars, getNumericEnvVar } from './util/envVars.js';
import apiRouter from './routes/router.js';
import swaggerMiddleware from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middleware/error-handling/error-handler.js';

const logger: Logger = getLogger();

const app: Express = express();
const port: string | number = getNumericEnvVar(envVars.Port);

app.use(express.json());
app.use(cors);
app.use(authenticateUser);
// Add response time logging
app.use(responseTime(responseTimeLogger));

app.use('/api', apiRouter);

// Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerMiddleware);

app.use(errorHandler);

async function startServer(): Promise<void> {
    await initORM();

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}/api`);
    });
}

await startServer();
