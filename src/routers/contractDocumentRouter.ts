import express from 'express';
import upload from '../middlewares/uploadMiddleware';
import {
  downloadContractDocumentController,
  uploadContractDocumentController,
} from '../controllers/contractDocumentController';

export const contractDocumentRouter = express.Router();

contractDocumentRouter.post(
  '/upload',
  upload.array('contractDocuments'),
  uploadContractDocumentController,
);

contractDocumentRouter.get('/:id/download', downloadContractDocumentController);
