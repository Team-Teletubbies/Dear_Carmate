import { Request, Response } from 'express';
import * as carService from '../services/carService';
import { createCarBodyStruct, updateCarBodyStruct } from '../structs/carStruct';
import { create } from 'superstruct';

export const registerCar = async (req: Request, res: Response): Promise<void> => {
  const data = create(req.body, createCarBodyStruct);
  // if (!req.user) {
  //   res.status(401).json({ message: '인증된 사용자만 차량을 등록할 수 있습니다.' });
  // }
  // const user = req.user as { companyId: number };

  const registerCars = await carService.registerCar(
    data /* , {
    companyId: user.companyId,
  } */,
  );
  res.status(201).json(registerCars);
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = create(req.body, updateCarBodyStruct);

  const updatedCar = await carService.updateCar(Number(id), data);
  res.status(200).json(updatedCar);
};

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await carService.deleteCar(Number(id));
  res.status(204).send();
};
