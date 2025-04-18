import express from 'express';
import { companyRouter } from './routers/companyRouter';

const app: express.Application = express();
app.use(express.json());

app.use('/companies', companyRouter);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
