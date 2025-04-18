import { Car } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function createCar(data: Car) {
  return await prisma.car.create({
    data,
  });
}
