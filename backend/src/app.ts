import express, { Express } from 'express';
import { initORM } from './orm.js';

import { authenticateUser } from './middleware/auth/auth.js';
import cors from './middleware/cors.js';
import { getLogger, Logger } from './logging/initalize.js';
import { responseTimeLogger } from './logging/responseTimeLogger.js';
import responseTime from 'response-time';
import { EnvVars, getNumericEnvVar } from './util/envvars.js';
import apiRouter from './routes/router.js';

const logger: Logger = getLogger();

const app: Express = express();
const port: string | number = getNumericEnvVar(EnvVars.Port);

app.use(cors);
app.use(express.json());
app.use(responseTime(responseTimeLogger));
app.use(authenticateUser);

app.get('/api', apiRouter);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}/api`);
    });
}

await startServer();
