import express, { Express, Response } from 'express';
import { initORM } from './orm.js';
import { EnvVars, getNumericEnvVar } from './util/envvars.js';

import themeRoutes from './routes/themes.js';

import studentRouter from './routes/student.js';
import groupRouter from './routes/group.js';
import assignmentRouter from './routes/assignment.js';
import submissionRouter from './routes/submission.js';
import classRouter from './routes/class.js';
import questionRouter from './routes/question.js';
import loginRouter from './routes/login.js';

const app: Express = express();
const port: string | number = getNumericEnvVar(EnvVars.Port);


// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
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
app.use('/login', loginRouter);

app.use('/theme', themeRoutes);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

await startServer();
