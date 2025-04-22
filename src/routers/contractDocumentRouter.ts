import express from 'express';
import upload from '../middlewares/uploadMiddleware';
import { uploadContractDocumentController } from '../controllers/contractDocumentController';

export const contractDocumentRouter = express.Router();

contractDocumentRouter.post(
  '/upload',
  upload.array('contractDocuments'),
  uploadContractDocumentController,
);
