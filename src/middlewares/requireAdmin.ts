import { RequestHandler } from 'express';
import { asyncHandler } from '../lib/async-handler';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import * as userRepository from '../repositories/userRepository';

export const requireAdmin: RequestHandler = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('로그인이 필요합니다');
  }
  const user = await userRepository.getById(userId);
  if (!user.isAdmin) {
    throw new UnauthorizedError('관리자 권한이 필요합니다');
  }
  return next();
});
