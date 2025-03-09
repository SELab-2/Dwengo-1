import express, { Express, Response } from 'express';
import { initORM } from './orm.js';
import { EnvVars, getNumericEnvVar } from './util/envvars.js';

import themeRoutes from './routes/themes.js';
import learningPathRoutes from './routes/learning-paths.js';
import learningObjectRoutes from './routes/learning-objects.js';

import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import groupRoutes from './routes/groups.js';
import submissionRoutes from './routes/submissions.js';
import classRoutes from './routes/classes.js';
import questionRoutes from './routes/questions.js';

const app: Express = express();
const port: string | number = getNumericEnvVar(EnvVars.Port);

app.use(express.json());

app.use(express.json());

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    res.json({
        message: 'Hello Dwengo!🚀',
    });
});

app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);
app.use('/group', groupRoutes);
app.use('/submission', submissionRoutes);
app.use('/class', classRoutes);
app.use('/question', questionRoutes);

app.use('/theme', themeRoutes);
app.use('/learningPath', learningPathRoutes);
app.use('/learningObject', learningObjectRoutes);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

await startServer();
