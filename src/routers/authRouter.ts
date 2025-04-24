import express from 'express';
import { login, refreshToken } from '../controllers/userController';
import { asyncHandler } from '../lib/async-handler';
import { verifyRefreshToken } from '../middlewares/verifyRefreshToken';

export const authRouter = express.Router();

authRouter.post('/login', asyncHandler(login));
authRouter.post('/refresh', verifyRefreshToken, refreshToken);
