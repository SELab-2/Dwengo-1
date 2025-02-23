import express, { Express, Response } from 'express';
import initORM from './orm.js';
import { getLogger } from './logging/initalize.js';
import { responseTimeLogger } from './logging/responseTimeLogger.js';
import responseTime from 'response-time';
import { Logger } from 'winston';

const logger: Logger = getLogger();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(express.json());
app.use(responseTime(responseTimeLogger));

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    logger.debug('GET /');
    res.json({
        message: 'Hello Dwengo!',
    });
});

async function startServer() {
    await initORM();

    app.listen(port, () => {
        logger.info(`Server is running at http://localhost:${port}`);
    });
}

startServer();
