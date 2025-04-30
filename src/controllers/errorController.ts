import { StructError } from 'superstruct';
import { UnauthorizedError as jwtUnauthorized } from 'express-jwt';
import BadRequestError from '../lib/errors/badRequestError';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import NotFoundError from '../lib/errors/notFoundError';
import { Request, Response, NextFunction } from 'express';
import forbiddenError from '../lib/errors/forbiddenError';
import ConflictError from '../lib/errors/conflictError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction): void {
  res.status(404).json({ message: 'Not found' });
}

export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    return next(err);
  }

  // 400 오류
  if (err instanceof StructError) {
    res.status(400).json({ message: '잘못된 요청입니다' });
    return;
  }

  if (err instanceof BadRequestError) {
    res.status(400).json({ message: err.message });
    return;
  }

  if (err instanceof SyntaxError || (isBadRequestError(err) && err.status === 400)) {
    res.status(400).json({ message: err.message });
    return;
  }

  // 404 오류
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
    return;
  }

  if (
    err instanceof PrismaClientKnownRequestError &&
    err.code === 'P2025' &&
    err.meta !== undefined
  ) {
    let model = '';

    switch (err.meta.modelName) {
      case 'User':
        model = '유저';
        break;
      case 'Company':
        model = '회사';
        break;
      default:
        model = 'unknown';
        break;
    }

    res.status(404).json({ message: `존재하지 않는 ${model}입니다.` });
  }

  // 401 오류
  if (hasCode(err) && (err.code === 'credentials_required' || err.code === 'invalid_token')) {
    res.status(401).json({ message: '로그인이 필요합니다' });
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: err.message });
    return;
  }

  // 403 오류
  if (err instanceof forbiddenError) {
    res.status(403).json({ message: err.message });
    return;
  }

  // 409 오류
  if (err instanceof ConflictError) {
    res.status(409).json({ message: err.message });
    return;
  }

  if (
    err instanceof PrismaClientKnownRequestError &&
    err.code === 'P2002' &&
    err.meta !== undefined
  ) {
    const targets = Array.isArray(err.meta.target) ? err.meta.target : [err.meta.target];

    const translatedFields = targets.map((field) => {
      switch (field) {
        case 'carNumber':
          return '차량번호';
        case 'modelId':
          return '차량모델';
        case 'companyId':
          return '회사 ID';
        case 'userId':
          return '유저 ID';
        case 'customerId':
          return '고객 ID';
        default:
          return field;
      }
    });

    const model = translatedFields.join(', ');

    res.status(409).json({ message: `이미 존재하는 ${model}입니다.` });
  }

  // 500 오류
  console.log(err);
  res.status(500).json({ message: 'Internal server error' });
  return;
}

function isBadRequestError(err: unknown): err is BadRequestError {
  return err instanceof BadRequestError;
}

function hasCode(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}
