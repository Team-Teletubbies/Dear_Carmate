import express from 'express';
// Todo: withAsync 가져와서 적용
// Todo: 인증인가 미들웨어 가져와서 적용
import { createUser } from '../controllers/userController';

export const userRouter = express.Router();

userRouter.post('/', createUser);
