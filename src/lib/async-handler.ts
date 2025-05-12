import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../types/express';

export function asyncHandler<TReq extends Request = Request>(
  handler: (req: TReq, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req as TReq, res, next);
    } catch (e) {
      next(e);
    }
  };
}
