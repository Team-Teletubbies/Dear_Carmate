import express from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import {
  createContract,
  getGroupedContracts,
  patchContracts,
} from '../controllers/contractController';
export const contractRouter = express.Router();

contractRouter.post('/', verifyAccessToken, createContract);
contractRouter.get('/', verifyAccessToken, getGroupedContracts);
contractRouter.patch('/:id', verifyAccessToken, patchContracts);
