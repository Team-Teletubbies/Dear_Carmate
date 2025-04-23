import express from 'express';
import { login } from '../controllers/userController';
import { asyncHandler } from '../lib/async-handler';

export const authRouter = express.Router();

authRouter.post('/login', asyncHandler(login));
