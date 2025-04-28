import express from 'express';
import {
  carCsvUpload,
  deleteCar,
  getCarDetail,
  getCarList,
  getManufacturerModelList,
  registerCar,
  updateCar,
} from '../controllers/carController';
import { asyncHandler } from '../lib/async-handler';
import upload from '../middlewares/uploadMiddleware';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';

const carRouter = express.Router();

carRouter.post('/', asyncHandler(registerCar));
carRouter.patch('/:id', asyncHandler(updateCar));
carRouter.delete('/:id', asyncHandler(deleteCar));
carRouter.get('/', asyncHandler(getCarList));
carRouter.get('/models', asyncHandler(getManufacturerModelList));
carRouter.get('/:id', asyncHandler(getCarDetail));
carRouter.post('/upload', upload.single('file'), verifyAccessToken, asyncHandler(carCsvUpload));

export default carRouter;
