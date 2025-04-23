import Express from 'express';

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
