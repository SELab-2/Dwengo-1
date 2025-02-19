import express, {Express, Request, Response} from 'express';
import initORM from './orm'

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

// TODO Replace with Express routes
app.get('/', (_, res: Response) => {
  res.json({
      message: 'Hello Dwengo!'
  });
});

async function startServer() {
  const orm = await initORM();
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer();
