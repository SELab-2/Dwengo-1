import express, { Express } from 'express';
import { initORM } from '../src/orm.js';
import apiRouter from '../src/routes/router.js';
import { errorHandler } from '../src/middleware/error-handling/error-handler.js';
import dotenv from 'dotenv';
import cors from '../src/middleware/cors';
import { authenticateUser } from '../src/middleware/auth/auth';
import { seedORM } from './seed';

const envFile = '../.env.test';

dotenv.config({ path: envFile });

const app: Express = express();

app.use(express.json());
app.use(cors);
app.use(authenticateUser);

app.use('/api', apiRouter);
app.use(errorHandler);

async function startServer(): Promise<void> {
    await seedORM(await initORM(true));

    app.listen(9876);
}

await startServer();
