import express from 'express';
import { registerCar } from '../controllers/carController';

const carRoutder = express.Router();

carRoutder.post('/', registerCar);

export default carRoutder;
