import * as carRepository from '../repositories/carRepository';
import { CarType } from '../types/carType';

export const registerCar = async (data: CarType) => {
  const createCar = await carRepository.createCar(data);
  return createCar;
};
