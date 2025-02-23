import express, { Express, Response } from 'express';
import initORM from './orm.js';

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    res.json({
        message: 'Hello Dwengo!',
    });
});

async function startServer() {
    await initORM();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}


import { LokiClient, LogError, LokiLabels, LogInfo } from 'loki-logger-ts';

const HostData = {
    url: "http://localhost:3100/loki/api/v1/push",
};

const labels: LokiLabels = {
    source: "Test",
    job: "TestJob",
    host: "localhost",
};

async function main() {
    const client = new LokiClient(HostData.url);

    const msg = 'Hello World';
    await LogError(client, msg, labels);
    await LogInfo(client, 'Dit is een goed bericht', labels);

    console.log(client.showMetrics());

    console.log(client.getMetrics());
}

main();

// startServer();
