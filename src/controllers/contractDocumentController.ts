import { Request, Response } from 'express';
import NotFoundError from '../lib/errors/notFoundError';
import { uploadContractDocument } from '../services/contractDocumentService';
import { asyncHandler } from '../lib/async-handler';

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
