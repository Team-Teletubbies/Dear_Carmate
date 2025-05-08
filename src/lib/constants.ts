import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const PUBLIC_PATH = path.resolve(process.cwd(), 'public/uploads'); // 실제 서버 디렉토리 경로, 이전에 'public'라고만 되어있던 부분을 'public/uploads'로 수정(브라우저에 업로드 하는 경로와 부분 일치화)
export const STATIC_PATH = '/uploads'; // 브라우저에서 접근할 URL prefix, 이전에 '/public'로 되어있었는데 프론트코드에서 '/uploads'로 지정되어 있어서 수정
export const LIMIT_FILE_SIZE = 5 * 1024 * 1024;
