import express from 'express';
import { deleteCar, getCarList, registerCar, updateCar } from '../controllers/carController';
import { asyncHandler } from '../lib/async-handler';

const carRouter = express.Router();

carRouter.post('/', asyncHandler(registerCar));
carRouter.patch('/:id', asyncHandler(updateCar));
carRouter.delete('/:id', asyncHandler(deleteCar));
carRouter.get('/', asyncHandler(getCarList));

export default carRouter;
