import { CarStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { CarCsvRow, GetCarListDTO } from '../dto/carDTO';
import { mapCarStatus } from '../structs/carStruct';

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
  const searchByFields = ['carNumber', 'model', 'carStatus'] as const;
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
      case 'carStatus':
        const prismaCarStatus = mapCarStatus(keyword);
        if (prismaCarStatus) {
          where.carStatus = prismaCarStatus as CarStatus;
        } else {
          throw new Error(`Invalid car status: ${keyword}`);
        }
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
          manufacturer: { select: { name: true } },
        },
      },
    },
  });
  return {
    totalCount,
    carList,
  };
}

export async function getCarById(id: number) {
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
}

export async function getManufacturerModelList() {
  return await prisma.manufacturer.findMany({
    include: {
      models: {
        select: { name: true },
      },
    },
  });
}

export async function getCarByCarNumber(carNumber: string) {
  return await prisma.car.findUnique({
    where: { carNumber },
  });
}

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

export async function carCsvUpload(row: CarCsvRow, companyId: number) {
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
}
