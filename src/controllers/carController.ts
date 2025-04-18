import { Request, Response } from 'express';
import * as carService from '../services/carService';

export async function registerCar(req: Request, res: Response) {
  const data = req.body;
  const registerCars = await carService.registerCar(data);

  res.status(201).json(registerCars);
}
