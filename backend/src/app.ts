import express, { Express, Response } from 'express';
import { initORM } from './orm.js';

import themeRoutes from './routes/themes.js';
import learningPathRoutes from './routes/learning-paths.js';
import learningObjectRoutes from './routes/learning-objects.js';

import studentRouter from './routes/students.js';
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

const logger: Logger = getLogger();

const app: Express = express();
const port: string | number = getNumericEnvVar(EnvVars.Port);

app.use(cors);
app.use(express.json());
app.use(responseTime(responseTimeLogger));
app.use(authenticateUser);

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    logger.debug('GET /');
    res.json({
        message: 'Hello Dwengo!🚀',
    });
});

app.use('/student', studentRouter);
app.use('/group', groupRouter);
app.use('/assignment', assignmentRouter);
app.use('/submission', submissionRouter);
app.use('/class', classRouter);
app.use('/question', questionRouter);
app.use('/auth', authRouter);
app.use('/theme', themeRoutes);
app.use('/learningPath', learningPathRoutes);
app.use('/learningObject', learningObjectRoutes);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
    });
}

await startServer();
