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
  const normalizedName = row.manufacturer.trim().toUpperCase(); // 사용자나 CSV에서 받은 제조사 이름 앞뒤 공백을 제거하고(trim()), 대문자로 통일, KIA, kia, Kia 등을 모두 동일한 값으로 처리해 중복 등록 방지

  try {
    return await prisma.manufacturer.upsert({
      // upsert는 Prisma에서 "있으면 update, 없으면 create" 를 의미
      where: { name: normalizedName },
      update: {}, //제조사가 존재할 경우 아무것도 수정하지 않음
      create: { name: normalizedName }, // 제조사가 없으면 생성
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      // upsert() 내부에서 제조사 생성 시 이미 동일한 name이 생성돼 있는 경우 P2002 오류가 발생할 수 있음
      const existing = await prisma.manufacturer.findUnique({
        // upsert()에서 실패했을 경우, 다시 DB에서 해당 name으로 검색해서 가져옴
        where: { name: normalizedName },
      });

      if (existing) return existing;
    }
    throw err; // 예상 외 에러는 다시 throw
  }
}

async function upsertModel(row: CarCsvRow) {
  const normalizedModelName = row.model.trim().toUpperCase(); // "k5", " K5 ", "K5" 등 여러 표현을 "K5"로 정규화하여 중복을 방지
  const normalizedType = row.type.trim();
  const manufacturer = await upsertManufacturer(row);

  const existingModel = await prisma.carModel.findFirst({
    where: {
      name: normalizedModelName, // 현재 모델명이 동일하고 제조사 ID, type도 같은 경우를 DB에서 찾습니다.
      manufacturerId: manufacturer.id,
      type: normalizedType,
    },
  });

  if (existingModel) return existingModel;

  try {
    return await prisma.carModel.create({
      // 모델이 존재하지 않으면 생성
      data: {
        name: normalizedModelName,
        type: normalizedType,
        manufacturerId: manufacturer.id,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      // 중복 생성이 시도된 경우 (동시성 상황)
      const retry = await prisma.carModel.findFirst({
        // P2002가 발생했다는 건, 누군가 먼저 만들었단 뜻이므로 다시 한번 DB에서 조회
        where: {
          name: normalizedModelName,
          manufacturerId: manufacturer.id,
          type: normalizedType,
        },
      });
      if (retry) return retry; // 조회된 모델이 있다면 그대로 반환 (에러 회복 처리)
    }
    throw err;
  }
}

export async function carCsvUpload(row: CarCsvRow, companyId: number) {
  return await prisma.car.create({
    data: {
      carNumber: row.carNumber,
      manufacturerId: (await upsertManufacturer(row)).id,
      modelId: (await upsertModel(row)).id,
      mileage: parseInt(row.mileage),
      manufacturingYear: parseInt(row.manufacturingYear),
      price: parseInt(row.price),
      carStatus: row.carStatus.toUpperCase() as CarStatus,
      accidentCount: parseInt(row.accidentCount),
      explanation: row.explanation || '',
      accidentDetails: row.accidentDetails || '',
      companyId: companyId,
    },
  });
}
