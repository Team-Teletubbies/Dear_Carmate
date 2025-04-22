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

export async function findCarById(id: number) {
  return await prisma.car.findUnique({
    where: {
      id,
    },
  });
}

export async function updateCar(id: number, data: Prisma.CarUpdateInput) {
  return await prisma.car.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteCar(id: number) {
  return await prisma.car.delete({
    where: {
      id,
    },
  });
}

export async function getCarList() {
  return await prisma.car.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}
