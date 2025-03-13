import express, { Express, Response } from 'express';
import { initORM } from './orm.js';

import themeRoutes from './routes/themes.js';
import learningPathRoutes from './routes/learning-paths.js';
import learningObjectRoutes from './routes/learning-objects.js';

import studentRouter from './routes/student.js';
import groupRouter from './routes/group.js';
import assignmentRouter from './routes/assignment.js';
import submissionRouter from './routes/submission.js';
import classRouter from './routes/class.js';
import questionRouter from './routes/question.js';
import authRouter from './routes/auth.js';
import { authenticateUser } from './middleware/auth/auth.js';
import cors from './middleware/cors.js';
import { getLogger, Logger } from './logging/initalize.js';
import { responseTimeLogger } from './logging/responseTimeLogger.js';
import responseTime from 'response-time';
import { EnvVars, getNumericEnvVar } from './util/envvars.js';

const logger: Logger = getLogger();

const app: Express = express();
const port: string | number = getNumericEnvVar(EnvVars.Port);

app.use(cors);
app.use(express.json());
app.use(responseTime(responseTimeLogger));
app.use(authenticateUser);

// TODO Replace with Express routes
app.get('/api/', (_, res: Response) => {
    logger.debug('GET /api/');
    res.json({
        message: 'Hello Dwengo!🚀',
    });
});

app.use('/api/student', studentRouter);
app.use('/api/group', groupRouter);
app.use('/api/assignment', assignmentRouter);
app.use('/api/submission', submissionRouter);
app.use('/api/class', classRouter);
app.use('/api/question', questionRouter);
app.use('/api/auth', authRouter);
app.use('/api/theme', themeRoutes);
app.use('/api/learningPath', learningPathRoutes);
app.use('/api/learningObject', learningObjectRoutes);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}/api`);
    });
}

await startServer();
