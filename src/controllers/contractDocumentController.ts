import { Request, Response } from 'express';
import NotFoundError from '../lib/errors/notFoundError';
import {
  uploadContractDocument,
  downloadContractDocument,
} from '../services/contractDocumentService';
import { asyncHandler } from '../lib/async-handler';
import fs from 'fs';

export const uploadContractDocumentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];
    const { contractId, companyId } = req.body;

    if (!files || !contractId || !companyId) {
      throw new NotFoundError('필수 정보가 누락되었습니다.');
    }

    const baseData = {
      contractId: Number(contractId),
      companyId: Number(companyId),
    };

    const toUploadData = (file: Express.Multer.File) => ({
      ...baseData,
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
    });

    const fileDTOs = await Promise.all(
      files.map((file) => uploadContractDocument(toUploadData(file))),
    );

    res.status(201).json(fileDTOs);
    return;
  },
);

export const downloadContractDocumentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    console.log(id);
    const { filePath, fileName } = await downloadContractDocument(id);

    res.setHeader('Content-Disposition', `attachment; filename ="${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ message: '파일 다운로드 실패' });
      }
    });
  },
);
