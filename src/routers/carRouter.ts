import express from 'express';
import { deleteCar, registerCar, updateCar } from '../controllers/carController';
import { asyncHandler } from '../lib/async-handler';

const carRouter = express.Router();

carRouter.post('/', asyncHandler(registerCar));
carRouter.patch('/:id', asyncHandler(updateCar));
carRouter.delete('/:id', asyncHandler(deleteCar));

export default carRouter;
