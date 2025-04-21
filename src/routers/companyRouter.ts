import express from 'express';
import { createCompany, getCompanyList } from '../controllers/companyController';
// Todo: withAsync
// Todo: 인증인가 미들웨어들
export const companyRouter = express.Router();

companyRouter.route('/').post(createCompany).get(getCompanyList);
