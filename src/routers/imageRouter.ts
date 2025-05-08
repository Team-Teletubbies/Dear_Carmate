import express from 'express';
import { upload, uploadImage } from '../controllers/imageController';
import { asyncHandler } from '../lib/async-handler';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';

const imageRouter = express.Router();

imageRouter.post('/upload', upload.single('file'), verifyAccessToken, asyncHandler(uploadImage)); // 이전에 upload.single('image')라고 되어있었는데 프론트에서 upload.single('file')로 지정해 있어서 수정

export default imageRouter;
