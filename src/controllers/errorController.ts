import { StructError } from 'superstruct';
import { UnauthorizedError as jwtUnauthorized } from 'express-jwt';
import BadRequestError from '../lib/errors/badRequestError';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import NotFoundError from '../lib/errors/notFoundError';
import { Request, Response, NextFunction } from 'express';
import forbiddenError from '../lib/errors/forbiddenError';
import ConflictError from '../lib/errors/conflictError';

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

  // 500 오류
  if (hasCode(err)) {
    // 얘는 왜 따로 있나요?
    console.error(err);
    res.status(500).json({ message: 'Failed to process data' });
    return;
  }

  res.status(500).json({ message: 'Internal server error' });
  return;
}

function isBadRequestError(err: unknown): err is BadRequestError {
  return err instanceof BadRequestError;
}

function hasCode(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}
