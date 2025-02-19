import express, {Express, Request, Response} from 'express';

const app: Express = express();

const port: string | number = process.env.PORT || 3000;

app.get('/', (_, res: Response) => {
  res.json({
      message: 'Hello Dwengo!'
  });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
