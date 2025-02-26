import express, { Express, Response } from 'express';
import initORM from './orm.js';
import themeRoutes from "./routes/themes.js";


const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    res.json({
        message: 'Hello Dwengo!🚀',
    });
});

app.use("/theme", themeRoutes);


async function startServer() {
    //Await initORM();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

startServer();
