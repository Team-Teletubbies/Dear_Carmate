import multer from 'multer';
import { LIMIT_FILE_SIZE, PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import path from 'path';
import BadRequestError from '../lib/errors/badRequestError';
import { Request, Response } from 'express';
import fs from 'fs';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']; // 허용할 파일 형식
const MAX_FILE_SIZE = LIMIT_FILE_SIZE; // 용량 5 MB

const uploadDir = path.join(__dirname, '../../public'); // 업로드 된 파일을 받아줄 public 폴더가 없다면 생성해줌
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const upload = multer({
  storage: multer.diskStorage({
    // diskStorage는 파일을 로컬 디스크에 저장하는 스토리지 엔진
    destination(req, file, cb) {
      // destination: 업로드된 파일을 저장할 경로를 설정
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      // filename: 업로드된 파일의 이름을 설정
      const ext = path.extname(file.originalname);
      const existingName = path.basename(file.originalname, ext);
      const newFileName = `${existingName}-${Date.now()}${ext}`;
      cb(null, newFileName);
    },
  }),

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter: function (req, file, cb) {
    // fileFilter: 업로드된 파일의 형식을 필터링
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      const error = new BadRequestError('허용되지 않는 파일 형식입니다.');
      return cb(error);
    }

    cb(null, true);
  },
});

export async function uploadImage(req: Request, res: Response): Promise<void> {
  // 이미지 업로드 후 클라이언트에게 응답을 보내는 함수
  const host = req.get('host');
  if (!host) {
    throw new BadRequestError('호스트 정보가 없습니다.');
  }
  if (!req.file) {
    throw new BadRequestError('파일이 없습니다.');
  }

  const filePath = path.join(host, STATIC_PATH, req.file.filename); // 이미지가 클라이언트에서 접근 가능한 상대 URL 경로를 만들어주는 역할
  const fileUrl = `http://${filePath.replace(/\\/g, '/')}`; // 업로드된 이미지를 클라이언트가 접근할 수 있도록 정적 URL 형태로 가공해 응답으로 내려줌
  res.status(201).json({ fileUrl });
}
