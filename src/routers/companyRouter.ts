import express from 'express';
import { getUserList } from '../controllers/userController';
import {
  createCompany,
  getCompanyList,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import { requireAdmin } from '../middlewares/requireAdmin';
export const companyRouter = express.Router();
import { asyncHandler } from '../lib/async-handler';

companyRouter
  .route('/')
  .post(verifyAccessToken, requireAdmin, asyncHandler(createCompany))
  .get(verifyAccessToken, requireAdmin, asyncHandler(getCompanyList));
companyRouter.get('/users/', verifyAccessToken, requireAdmin, asyncHandler(getUserList));
companyRouter
  .route('/:id')
  .patch(verifyAccessToken, requireAdmin, asyncHandler(updateCompany))
  .delete(verifyAccessToken, requireAdmin, asyncHandler(deleteCompany));
