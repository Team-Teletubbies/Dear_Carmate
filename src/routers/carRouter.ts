import express from 'express';
import {
  deleteCar,
  getCarDetail,
  getCarList,
  getManufacturerModelList,
  registerCar,
  updateCar,
} from '../controllers/carController';
import { asyncHandler } from '../lib/async-handler';

const carRouter = express.Router();

carRouter.post('/', asyncHandler(registerCar));
carRouter.patch('/:id', asyncHandler(updateCar));
carRouter.delete('/:id', asyncHandler(deleteCar));
carRouter.get('/', asyncHandler(getCarList));
carRouter.get('/models', asyncHandler(getManufacturerModelList));
carRouter.get('/:id', asyncHandler(getCarDetail));

export default carRouter;
