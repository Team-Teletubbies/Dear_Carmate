import { Request, Response } from 'express';
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
import UnauthorizedError from '../lib/errors/unauthorizedError';

export const uploadContractDocumentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];
    const user = req.user;

    if (!files) {
      throw new NotFoundError('필수 정보가 누락되었습니다.');
    }

    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const toUploadData = (file: Express.Multer.File) => ({
      companyId: user.companyId,
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
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

    const { filePath, fileName } = await downloadContractDocument(user.userId, id);

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

export const getContractDocumentLists = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const data = create(req.query, contractDocumentFilterStruct);
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError('로그인이 필요합니다.');
    }

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
    console.log('조회 결과:', result);
    res.json(result);
  },
);

export const getDrafts = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError('로그인이 필요합니다.');
  }
  const data = await getDraftContractDocuments(user.companyId);
  res.json(data);
});
