import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

export const PUBLIC_PATH = path.resolve(process.cwd(), 'public/uploads');
export const STATIC_PATH = '/uploads';
export const LIMIT_FILE_SIZE = 5 * 1024 * 1024;
