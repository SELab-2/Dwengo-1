import express, { Express } from 'express';
import { initORM } from './orm.js';

import themeRoutes from './routes/themes.js';
import learningPathRoutes from './routes/learning-paths.js';
import learningObjectRoutes from './routes/learning-objects.js';

import studentRouter from './routes/students.js';
import teacherRouter from './routes/teachers.js';
import groupRouter from './routes/groups.js';
import assignmentRouter from './routes/assignments.js';
import submissionRouter from './routes/submissions.js';
import classRouter from './routes/classes.js';
import questionRouter from './routes/questions.js';
import authRouter from './routes/auth.js';

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
