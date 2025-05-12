import { RequestHandler } from 'express';
import { asyncHandler } from '../lib/async-handler';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import * as userRepository from '../repositories/userRepository';
import NotFoundError from '../lib/errors/notFoundError';

export const requireAdmin: RequestHandler = asyncHandler(async (req, res, next) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError('로그인이 필요합니다');
  }
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new NotFoundError('존재하지 않는 유저입니다');
  }
  if (!user.isAdmin) {
    throw new UnauthorizedError('관리자 권한이 필요합니다');
  }
  return next();
});
