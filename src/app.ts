import express from 'express';
import carRoutder from './routers/carRouter';
import { companyRouter } from './routers/companyRouter';
import { userRouter } from './routers/userRouter';
import customerRouter from './routers/customerRouter';

const app: express.Application = express();
app.use(express.json());

app.use('/cars', carRoutder);
app.use('/companies', companyRouter);
app.use('/users', userRouter);
<<<<<<< HEAD
app.use('/customers', customerRouter);
=======
app.use('/companies', companyRouter);
app.use('/users', userRouter);
>>>>>>> 8aa080d49f070b44251bef33fbad01dfdd001565

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
