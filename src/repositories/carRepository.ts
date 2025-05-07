import { CarStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CarCsvRow, GetCarListDTO } from '../dto/carDTO';
import { mapCarStatus } from '../structs/carStruct';

export const createCar = async function (data: Prisma.CarCreateInput) {
  return await prisma.car.create({
    data,
  });
};

export const findManufacturerId = async function (name: string) {
  return await prisma.manufacturer.findFirst({
    where: {
      name,
    },
  });
};

export const findModelId = async function (name: string, manufacturerId: number) {
  return await prisma.carModel.findFirst({
    where: {
      name,
      manufacturerId,
    },
  });
};

export const findCarById = async function (id: number) {
  return await prisma.car.findUnique({
    where: {
      id,
    },
  });
};

export const updateCar = async function (id: number, data: Prisma.CarUpdateInput) {
  const currentCar = await prisma.car.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      carNumber: true,
    },
  });

  const reqCarNumber = data.carNumber as string;

  if (reqCarNumber && reqCarNumber !== currentCar.carNumber) {
    const checkCarNumber = await prisma.car.findFirst({
      where: {
        carNumber: reqCarNumber,
        NOT: { id },
      },
    });
  }

  return await prisma.car.update({
    where: { id },
    data: {},
  });
};

export const deleteCar = async function (id: number) {
  return await prisma.car.delete({
    where: {
      id,
    },
  });
};

export const getCarList = async function (data: GetCarListDTO) {
  const { page, pageSize, searchBy = 'carNumber', keyword, status } = data;
  const searchByFields = ['carNumber', 'model'] as const;
  if (!searchByFields.includes(searchBy)) {
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

  if (status) {
    where.carStatus = mapCarStatus(status) as CarStatus;
  }

  const totalCount = await prisma.car.count({ where });

  const carList = await prisma.car.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where,
    include: {
      model: {
        include: {
          manufacturer: { select: { name: true } },
        },
      },
    },
  });
  return {
    totalCount,
    carList,
  };
};

export const getCarById = async function (id: number) {
  return await prisma.car.findUnique({
    where: {
      id,
    },
    include: {
      model: {
        include: {
          manufacturer: { select: { name: true } },
        },
      },
    },
  });
};

export const getManufacturerModelList = async function () {
  return await prisma.manufacturer.findMany({
    include: {
      models: {
        select: { name: true },
      },
    },
  });
};

export const getCarByCarNumber = async function (carNumber: string) {
  return await prisma.car.findUnique({
    where: { carNumber },
  });
};

async function upsertManufacturer(row: CarCsvRow) {
  const normalizedName = row.manufacturer.trim().toUpperCase();

  try {
    return await prisma.manufacturer.upsert({
      where: { name: normalizedName },
      update: {},
      create: { name: normalizedName },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const existing = await prisma.manufacturer.findUnique({
        where: { name: normalizedName },
      });

      if (existing) return existing;
    }
    throw err;
  }
}

async function upsertModel(row: CarCsvRow) {
  const normalizedModelName = row.model.trim().toUpperCase();
  const normalizedType = row.type.trim();
  const manufacturer = await upsertManufacturer(row);

  const existingModel = await prisma.carModel.findFirst({
    where: {
      name: normalizedModelName,
      manufacturerId: manufacturer.id,
      type: normalizedType,
    },
  });

  if (existingModel) return existingModel;

  try {
    return await prisma.carModel.create({
      data: {
        name: normalizedModelName,
        type: normalizedType,
        manufacturerId: manufacturer.id,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const retry = await prisma.carModel.findFirst({
        where: {
          name: normalizedModelName,
          manufacturerId: manufacturer.id,
          type: normalizedType,
        },
      });
      if (retry) return retry;
    }
    throw err;
  }
}

export const carCsvUpload = async function (row: CarCsvRow, companyId: number) {
  const manufacturer = await upsertManufacturer(row);
  const model = await upsertModel(row);
  const existing = await prisma.car.findUnique({
    where: { carNumber: row.carNumber },
  });

  if (existing) {
    throw new Error(`이미 등록된 차량번호입니다: ${row.carNumber}`);
  }

  return await prisma.car.create({
    data: {
      carNumber: row.carNumber,
      model: {
        connect: { id: model.id },
      },
      mileage: parseInt(row.mileage),
      manufacturingYear: parseInt(row.manufacturingYear),
      price: parseInt(row.price),
      carStatus: row.carStatus.toUpperCase() as CarStatus,
      accidentCount: parseInt(row.accidentCount),
      explanation: row.explanation || '',
      accidentDetails: row.accidentDetails || '',
      company: {
        connect: { id: companyId },
      },
    },
    include: {
      model: {
        include: {
          manufacturer: true,
        },
      },
    },
  });
};

export const getCarListForContract = async (
  companyId: number,
): Promise<{ id: number; carNumber: string; model: { name: string } }[]> => {
  return prisma.car.findMany({
    where: { companyId },
    include: {
      model: true,
    },
  });
};
