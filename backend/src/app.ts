import express, { Express, Response } from 'express';
import { initORM } from './orm.js';
import { EnvVars, getNumericEnvVar } from './util/envvars.js';

import themeRoutes from './routes/themes.js';

import studentRouter from './routes/student';
import groupRouter from './routes/group';
import assignmentRouter from './routes/assignment';
import submissionRouter from './routes/submission';
import classRouter from './routes/class';
import questionRouter from './routes/question';
import loginRouter from './routes/login';

import homeRouter from './routes/home.js';

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

app.use('/home', homeRouter);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

await startServer();
