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

carRouter.post('/', verifyAccessToken, asyncHandler(registerCar));
carRouter.patch('/:id', verifyAccessToken, asyncHandler(updateCar));
carRouter.delete('/:id', verifyAccessToken, asyncHandler(deleteCar));
carRouter.get('/', verifyAccessToken, asyncHandler(getCarList));
carRouter.get('/models', verifyAccessToken, asyncHandler(getManufacturerModelList));
carRouter.get('/:id', verifyAccessToken, asyncHandler(getCarDetail));
carRouter.post('/upload', upload.single('file'), verifyAccessToken, asyncHandler(carCsvUpload));

export default carRouter;
