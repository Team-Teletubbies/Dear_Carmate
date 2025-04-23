import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { GetCarListDTO } from '../dto/carDTO';

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

export async function findModelId(name: string, manufacturerId: number) {
  return await prisma.carModel.findFirst({
    where: {
      name,
      manufacturerId,
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

export async function getCarList(data: GetCarListDTO) {
  const { page, pageSize, searchBy = 'carNumber', keyword } = data;
  // searchBy = 'carNumber'로 기본값 설정(data.searchBy없을 때 에러 방지)
  const serchByFields = ['carNumber', 'model'] as const;
  if (!serchByFields.includes(searchBy)) {
    throw new Error(`유효하지 않은 searchBy 입니다. : ${searchBy}`);
  }

  let where: Prisma.CarWhereInput = {};

  if (keyword) {
    switch (searchBy) {
      case 'carNumber':
        where.carNumber = { contains: keyword, mode: 'insensitive' };
        break;
      case 'model':
        where.model = {
          name: { contains: keyword, mode: 'insensitive' },
        };
        break;
      default:
        break;
    }
  }

  const totalCount = await prisma.car.count({ where });

  const carList = await prisma.car.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where,
    include: {
      model: {
        include: {
          manufacturer: { select: { name: true } }, //Car → model → manufacturer 로 연결되 있으니 중첩 include로 가져옴 // manufacturer의 name만 가져옴
        },
      },
    },
  });
  return {
    totalCount,
    carList,
  };
}
