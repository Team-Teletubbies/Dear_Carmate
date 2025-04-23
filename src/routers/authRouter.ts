import express from 'express';
import { login } from '../controllers/userController';
import { asyncHandler } from '../lib/async-handler';

const authRouter = express.Router();

authRouter.get('/login', asyncHandler(login));
