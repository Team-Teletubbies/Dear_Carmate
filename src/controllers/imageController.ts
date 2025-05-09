import multer from 'multer';
import { LIMIT_FILE_SIZE, PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import path from 'path';
import BadRequestError from '../lib/errors/badRequestError';
import { Request, Response } from 'express';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = LIMIT_FILE_SIZE;

function generateFileName(originalname: string): string {
  const ext = path.extname(originalname);
  const originalBuffer = Buffer.from(originalname, 'latin1');
  const decodedName = originalBuffer.toString('utf8');
  const baseName = path
    .basename(decodedName, ext)
    .normalize('NFC')
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '_');

  return `${baseName}-${Date.now()}${ext}`;
}

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      cb(null, generateFileName(file.originalname));
    },
  }),

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter: function (req, file, cb) {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      return cb(new Error('허용되지 않는 파일 형식입니다.'));
    }

    cb(null, true);
  },
});

function getUploadedImageUrl(host: string, filename: string): string {
  return `http://${host}/uploads/${encodeURIComponent(filename)}`;
}

export async function uploadImage(req: Request, res: Response): Promise<void> {
  const host = req.get('host');
  if (!host) {
    throw new BadRequestError('호스트 정보가 없습니다.');
  }
  if (!req.file) {
    throw new BadRequestError('파일이 없습니다.');
  }

  const imageUrl = getUploadedImageUrl(host, req.file.filename);
  res.status(201).json({ imageUrl });
}
