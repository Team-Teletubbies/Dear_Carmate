import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const PUBLIC_PATH = path.resolve(process.cwd(), 'public'); // 저장될 로컬 폴더 경로 (절대경로)
export const STATIC_PATH = '/public'; // 클라이언트가 접근할 수 있는 URL 경로
export const LIMIT_FILE_SIZE = 5 * 1024 * 1024;
