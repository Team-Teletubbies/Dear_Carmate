import express from 'express';
import { registerCar } from '../controllers/carController';

const carRouter = express.Router();

carRouter.post('/', registerCar);

export default carRouter;
