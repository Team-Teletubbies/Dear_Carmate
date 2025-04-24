import express from 'express';
import { upload, uploadImage } from '../controllers/imageController';
import { asyncHandler } from '../lib/async-handler';

const imageRouter = express.Router();

imageRouter.post('/upload', upload.single('image'), asyncHandler(uploadImage));

export default imageRouter;
