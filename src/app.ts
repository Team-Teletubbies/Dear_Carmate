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
app.use(STATIC_PATH, express.static(PUBLIC_PATH)); // 이전에 app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH))); 이라고 되어있었는데 path.resolve(process.cwd()라는 코드는 이미 변수 PUBLIC_PATH의 값이었음. 잘못 기재되있던 부분 수정
// 서버 디렉토리 구조가 ./public/uploads/**.png 처럼
// Express.static('public')으로 /uploads/... 정적 경로를 제공하고 있다면 위 코드가 작동

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
