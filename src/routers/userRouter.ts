import express from 'express';
// Todo: withAsync 가져와서 적용
// Todo: 인증인가 미들웨어 가져와서 적용

import {
  createUser,
  getMyInfo,
  updateMyInfo,
  deleteMyAccount,
  deleteUser,
} from '../controllers/userController';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import { requireAdmin } from '../middlewares/requireAdmin';
import { asyncHandler } from '../lib/async-handler';

export const userRouter = express.Router();

userRouter.post('/', asyncHandler(createUser));
userRouter
  .route('/me')
  .all(verifyAccessToken)
  .get(asyncHandler(getMyInfo))
  .patch(asyncHandler(updateMyInfo))
  .delete(asyncHandler(deleteMyAccount));
userRouter.delete('/:id', verifyAccessToken, requireAdmin, asyncHandler(deleteUser));
