import express from 'express';
import { createCompany } from '../controllers/companyController';
// Todo: withAsync
// Todo: 인증인가 미들웨어들
export const companyRouter = express.Router();

companyRouter.post('/', createCompany);
