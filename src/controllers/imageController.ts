import multer from 'multer';
import { LIMIT_FILE_SIZE, PUBLIC_PATH, STATIC_PATH } from '../lib/constants';
import path from 'path';
import BadRequestError from '../lib/errors/badRequestError';
import { Request, Response } from 'express';
import fs from 'fs';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif']; // 허용할 파일 형식
const MAX_FILE_SIZE = LIMIT_FILE_SIZE; // 용량 5 MB

const uploadDir = path.join(__dirname, '../../public/uploads'); // 업로드 된 파일을 받아줄 public/uploads 폴더가 없다면 생성해줌
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
      const originalBuffer = Buffer.from(file.originalname, 'latin1'); // Buffer로 감싸서 문자열을 버퍼로 바꿈
      // multer가 파일이름을 latin1(서유럽 인코딩)로 종종 받아오는데 그런경우 Buffer로 감싼 후 utf8로 강제로 디코딩해서 정상적으로 한글 파일명 받아오도록 함

      const decodedName = originalBuffer.toString('utf8'); // 버퍼를 다시 문자열로 변환

      const baseName = path
        .basename(decodedName, ext)
        .normalize('NFC') // 	일부 시스템에서 조합형 한글(초성+중성+종성)이 깨지는 걸 방지
        .replace(/[/\\?%*:|"<>]/g, '') // (특수문자 등)위험 문자 제거, (한글,영어,숫자 가능)
        .replace(/\s+/g, '_'); // 공백 -> 밑줄

      const newFileName = `${baseName}-${Date.now()}${ext}`; // 원본파일이름-타임스탬프.확장자 형식
      cb(null, newFileName);
    },
  }),

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter: function (req, file, cb) {
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
  const imageUrl = `http://${host}/uploads/${encodeURIComponent(req.file.filename)}`;
  /*이전의 코드
  const filePath = path.join(host, STATIC_PATH, req.file.filename);
  const fileUrl = `http://${encodeURI(filePath.replace(/\\/g, '/'))}`

  이 방식은 host, STATIC_PATH를 조합해 만든 경로여서 URL로 변환한 것이기 떄문에 실제 URL이 아니라 경로 기반의 조합이었음.

  프론트엔드에서 `http://localhost:3000/uploads/**` 처럼 원해서 그에 맞게 URL경로로 해석되도록 직접 구성해주는 방식으로 수정.
  */
  res.status(201).json({ imageUrl }); // 경로 변수명을 이전엔 fileUrl이라 하였는데 프론트에서 imageUrl로 받을거라 예상하고 코드 작성됨
}
