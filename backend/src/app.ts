import express, { Express, Response } from 'express';
import { initORM } from './orm.js';

import themeRoutes from './routes/themes.js';
import learningPathRoutes from './routes/learningPaths.js';
import learningObjectRoutes from './routes/learningObjects.js';

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

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    logger.debug('GET /');
    res.json({
        message: 'Hello Dwengo!🚀',
    });
});

// Routes
app.use('/student', studentRouter /* #swagger.tags = ['Student'] */);
app.use('/group', groupRouter /* #swagger.tags = ['Group'] */);
app.use('/assignment', assignmentRouter /* #swagger.tags = ['Assignment'] */);
app.use('/submission', submissionRouter /* #swagger.tags = ['Submission'] */);
app.use('/class', classRouter /* #swagger.tags = ['Class'] */);
app.use('/question', questionRouter /* #swagger.tags = ['Question'] */);
app.use('/auth', authRouter /* #swagger.tags = ['Auth'] */);
app.use('/theme', themeRoutes /* #swagger.tags = ['Theme'] */);

app.use(
    '/learningPath',
    learningPathRoutes /* #swagger.tags = ['Learning Path'] */
);
app.use(
    '/learningObject',
    learningObjectRoutes /* #swagger.tags = ['Learning Object'] */
);

// Swagger UI for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerMiddleware);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
    });
}

await startServer();
