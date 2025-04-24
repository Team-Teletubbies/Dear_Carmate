import express from 'express';
// Todo: withAsync 가져와서 적용
// Todo: 인증인가 미들웨어 가져와서 적용

import { createUser, getMyInfo } from '../controllers/userController';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';

export const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.get('/me', verifyAccessToken, getMyInfo);
