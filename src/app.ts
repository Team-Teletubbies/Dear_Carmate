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
import path from 'path';
import { PUBLIC_PATH, STATIC_PATH } from './lib/constants';
import imageRouter from './routers/imageRouter';
import dashboardRouter from './routers/dashboardRouter';
import { multerErrorHandler } from './lib/multerError';

const app: express.Application = express();
app.use(express.json());
app.use(cors());
app.use(STATIC_PATH, express.static(PUBLIC_PATH));

app.use('/cars', carRoutder);
app.use('/companies', companyRouter);
app.use('/users', userRouter);
app.use('/contracts', contractRouter);
app.use('/contractDocuments', contractDocumentRouter);
app.use('/customers', customerRouter);
app.use('/auth', authRouter);
app.use('/images', imageRouter);
app.use('/dashboard', dashboardRouter);

app.use(defaultNotFoundHandler);
app.use(multerErrorHandler);
app.use(globalErrorHandler);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
