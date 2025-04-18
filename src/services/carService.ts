import * as carRepository from '../repositories/carRepository';
import { CarType } from '../types/carType';

export async function registerCar(data: CarType): Promise<CarType> {
  const createCar = await carRepository.createCar(data);
  return createCar;
}
