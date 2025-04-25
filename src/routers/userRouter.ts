import express from 'express';
// Todo: withAsync 가져와서 적용
// Todo: 인증인가 미들웨어 가져와서 적용

<<<<<<< HEAD
import {
  createUser,
  getMyInfo,
  updateMyInfo,
  deleteMyAccount,
} from '../controllers/userController';
=======
import { createUser, getMyInfo, updateMyInfo, deleteUser } from '../controllers/userController';
>>>>>>> 9f646c2 (rebase 전 커밋)
import { verifyAccessToken } from '../middlewares/verifyAccessToken';

export const userRouter = express.Router();

userRouter.post('/', createUser);
<<<<<<< HEAD
userRouter
  .route('/me')
  .all(verifyAccessToken)
  .get(getMyInfo)
  .patch(updateMyInfo)
  .delete(deleteMyAccount);
=======
userRouter.route('/me').get(verifyAccessToken, getMyInfo).patch(verifyAccessToken, updateMyInfo);
userRouter.delete('/:id', deleteUser);
>>>>>>> 9f646c2 (rebase 전 커밋)
