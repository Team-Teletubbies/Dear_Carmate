import Express from 'express';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        companyId: number;
      };
    }
  }
}

export type AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals = any,
> = Request<P, ResBody, ReqBody, ReqQuery, Locals> & {
  user: {
    userId: number;
    companyId: number;
  };
};
