import express from 'express';
import upload from '../middlewares/uploadMiddleware';
import {
  downloadContractDocumentController,
  uploadContractDocumentController,
  getContractDocumentLists,
  getDrafts,
} from '../controllers/contractDocumentController';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';

export const contractDocumentRouter = express.Router();

contractDocumentRouter.post(
  '/upload',
  verifyAccessToken,
  upload.single('file'),
  uploadContractDocumentController,
);

contractDocumentRouter.get('/:id/download', verifyAccessToken, downloadContractDocumentController);

contractDocumentRouter.get('/', verifyAccessToken, getContractDocumentLists);

contractDocumentRouter.get('/draft', verifyAccessToken, getDrafts);
