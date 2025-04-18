import express from 'express';
// Todo: withAsync
// Todo: controller들
// Todo: token verify 미들웨어들
import { createCompany } from '../controllers/companyController';
export const companyRouter = express.Router();

companyRouter.post('/', createCompany);
