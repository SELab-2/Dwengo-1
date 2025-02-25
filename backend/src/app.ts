import express, { Express, Response } from 'express';
import { initORM } from './orm.js';

import studentRouter from './routes/student';
import groupRouter from './routes/group';
import assignmentRouter from './routes/assignment';
import submissionRouter from './routes/submission';
import classRouter from './routes/class';
import questionRouter from './routes/question';
import loginRouter from './routes/login';

const app: Express = express();
const port: string | number = process.env.PORT || 3000;


// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    res.json({
        message: 'Hello Dwengo!',
    });
});

app.use('/student', studentRouter);
app.use('/group', groupRouter);
app.use('/assignment', assignmentRouter);
app.use('/submission', submissionRouter);
app.use('/class', classRouter);
app.use('/question', questionRouter);
app.use('/login', loginRouter);


async function startServer() {
    //await initORM();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

startServer();
