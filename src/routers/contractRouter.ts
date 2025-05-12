import express from 'express';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import {
  createContract,
  getGroupedContracts,
  patchContracts,
  deleteContract,
  getDetailList,
} from '../controllers/contractController';
export const contractRouter = express.Router();

contractRouter.post('/', verifyAccessToken, createContract);
contractRouter.get('/', verifyAccessToken, getGroupedContracts);
contractRouter.patch('/:id', verifyAccessToken, patchContracts);
contractRouter.delete('/:id', verifyAccessToken, deleteContract);
contractRouter.get('/cars', verifyAccessToken, getDetailList);
contractRouter.get('/customers', verifyAccessToken, getDetailList);
contractRouter.get('/users', verifyAccessToken, getDetailList);
