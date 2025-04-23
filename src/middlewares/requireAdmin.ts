import { RequestHandler } from 'express';
import { asyncHandler } from '../lib/async-handler';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import * as userRepository from '../repositories/userRepository';

export const requireAdmin: RequestHandler = asyncHandler(async (req, res, next) => {
  const userId = req.user!.userId;
  const user = await userRepository.getById(userId);
  if (!user.isAdmin) {
    throw new UnauthorizedError('담당자만 가능합니다.');
  }
  return next();
});
