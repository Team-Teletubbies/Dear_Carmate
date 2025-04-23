import express from 'express';
import carRoutder from './routers/carRouter';
import { companyRouter } from './routers/companyRouter';
import { userRouter } from './routers/userRouter';
import { contractRouter } from './routers/contractRouter';
import { authRouter } from './routers/authRouter';
import { contractDocumentRouter } from './routers/contractDocumentRouter';
import { defaultNotFoundHandler, globalErrorHandler } from './controllers/errorController';
import cors from 'cors';
import customerRouter from './routers/customerRouter';

const app: express.Application = express();
app.use(express.json());
app.use(cors());
app.use('/cars', carRoutder);
app.use('/companies', companyRouter);
app.use('/users', userRouter);
app.use('/contracts', contractRouter);
app.use('/contractDocuments', contractDocumentRouter);
app.use('/customers', customerRouter);
app.use('/auth', authRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
