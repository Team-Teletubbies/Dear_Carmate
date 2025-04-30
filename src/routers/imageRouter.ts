import express from 'express';
import { upload, uploadImage } from '../controllers/imageController';
import { asyncHandler } from '../lib/async-handler';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';

const imageRouter = express.Router();

imageRouter.post('/upload', upload.single('image'), verifyAccessToken, asyncHandler(uploadImage));

export default imageRouter;
