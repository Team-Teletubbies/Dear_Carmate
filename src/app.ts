import express from 'express';
import carRoutder from './routers/carRouter';
import { companyRouter } from './routers/companyRouter';
import { userRouter } from './routers/userRouter';

const app: express.Application = express();
app.use(express.json());

app.use('/cars', carRoutder);
app.use('/companies', companyRouter);
app.use('/users', userRouter);

app.use('/companies', companyRouter);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
