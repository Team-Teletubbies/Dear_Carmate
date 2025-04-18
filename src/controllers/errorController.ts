import { StructError } from 'superstruct';
import BadRequestError from '../lib/errors/badRequestError';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import NotFoundError from '../lib/errors/notFoundError';
import { Request, Response, NextFunction } from 'express';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction): void {
  res.status(404).send({ message: 'Not found' });
}

export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof StructError || err instanceof BadRequestError) {
    res.status(400).send({ message: err.message });
    return;
  }

  if (err instanceof SyntaxError || (isBadRequestError(err) && err.status === 400)) {
    res.status(400).send({ message: 'Invalid JSON' });
    return;
  }

  if (hasCode(err)) {
    console.error(err);
    res.status(500).send({ message: 'Failed to process data' });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).send({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).send({ message: 'Internal serveer error' });
    return;
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
  return;
}

function isBadRequestError(err: unknown): err is BadRequestError {
  return err instanceof BadRequestError;
}

function hasCode(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}
