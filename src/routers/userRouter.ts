import express from 'express';
// Todo: withAsync 가져와서 적용
// Todo: 인증인가 미들웨어 가져와서 적용

import {
  createUser,
  getMyInfo,
  updateMyInfo,
  deleteMyAccount,
} from '../controllers/userController';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';

export const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter
  .route('/me')
  .all(verifyAccessToken)
  .get(getMyInfo)
  .patch(updateMyInfo)
  .delete(deleteMyAccount);
