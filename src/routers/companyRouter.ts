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
// Todo: withAsync
// Todo: 인증인가 미들웨어들
export const companyRouter = express.Router();

companyRouter.route('/').post(verifyAccessToken, requireAdmin, createCompany).get(getCompanyList);
companyRouter.get('/users/', getUserList);
companyRouter.route('/:id').patch(updateCompany).delete(deleteCompany);
