import { Response } from 'express';
import NotFoundError from '../lib/errors/notFoundError';
import {
  uploadContractDocument,
  downloadContractDocument,
  getContractDocumentList,
  getDraftContractDocuments,
} from '../services/contractDocumentService';
import { asyncHandler } from '../lib/async-handler';
import fs from 'fs';
import { create } from 'superstruct';
import { contractDocumentFilterStruct } from '../structs/contractDocumentStruct';
import BadRequestError from '../lib/errors/badRequestError';
import { AuthenticatedRequest } from '../types/express';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import { IdParamsStruct } from '../structs/commonStruct';

export const uploadContractDocumentController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];
    const user = req.user;

    if (!files) {
      throw new NotFoundError('필수 정보가 누락되었습니다.');
    }

    const toUploadData = (file: Express.Multer.File) => ({
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
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const id = create(req.params.id, IdParamsStruct);
    const user = req.user;

    const { filePath, fileName } = await downloadContractDocument(user.userId, id.id);

    res.setHeader('Content-Disposition', `attachment; filename ="${fileName}"`);
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

export const getContractDocumentLists = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const data = create(req.query, contractDocumentFilterStruct);
    const user = req.user;
    if (!data) {
      throw new BadRequestError('잘못된 요청 입니다.');
    }

    const baseData = {
      page: Number(data.page),
      pageSize: Number(data.pageSize),
      keyword: data.keyword,
      searchBy: data.searchBy,
      companyId: Number(user.companyId),
    };

    const result = await getContractDocumentList(baseData);
    res.json(result);
  },
);

export const getDrafts = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  const data = await getDraftContractDocuments(user.companyId);
  res.json(data);
});
