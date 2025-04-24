import express from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import { createContract } from '../controllers/contractController';
export const contractRouter = express.Router();

contractRouter.post('/', verifyAccessToken, createContract);
