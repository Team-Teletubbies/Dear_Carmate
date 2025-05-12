import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import { LIMIT_FILE_SIZE } from '../lib/constants';

export const multerErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  if (err instanceof MulterError) {
    const maxFileSizeInMB = LIMIT_FILE_SIZE / (1024 * 1024);

    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        message: `파일 크기가 너무 큽니다. 최대 ${maxFileSizeInMB}MB까지 허용됩니다.`,
      });
      return;
    }

    res.status(400).json({
      message: '파일 업로드 중 오류가 발생했습니다.',
      error: err.message,
    });
    return;
  }

  next(err);
};
