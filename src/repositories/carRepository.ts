import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function createCar(data: Prisma.CarCreateInput) {
  return await prisma.car.create({
    data,
  });
}

export async function findManufacturerId(name: string) {
  return await prisma.manufacturer.findFirst({
    where: {
      name,
    },
  });
}

export async function findModelId(name: string) {
  return await prisma.carModel.findFirst({
    where: {
      name,
    },
  });
}
