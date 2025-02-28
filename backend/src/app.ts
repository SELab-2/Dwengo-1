import express, { Express, Response } from 'express';
import initORM from './orm.js';
import themeRoutes from './routes/themes.js';
import learningPathRoutes from './routes/learningPaths.js';
import learningObjectRoutes from './routes/learningObjects.js';

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
    res.json({
        message: 'Hello Dwengo!🚀',
    });
});

app.use('/theme', themeRoutes);
app.use('/learningPath', learningPathRoutes);
app.use('/learningObject', learningObjectRoutes);

async function startServer() {
    await initORM();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

startServer();
