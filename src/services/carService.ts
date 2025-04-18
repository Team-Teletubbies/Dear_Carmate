import { CarStatus } from '@prisma/client';
import * as carRepository from '../repositories/carRepository';
import { CarType } from '../types/carType';
import { registerCarDTO } from '../dto/carDTO';

export async function registerCar(
  data: CarType,
  // user: { companyId: number },
): Promise<registerCarDTO> {
  const { manufacturer, model, ...rest } = data;

  const manufacturerData = await carRepository.findManufacturerId(manufacturer);
  if (!manufacturerData) throw new Error('존재하지 않는 제조사입니다.');

  const modelData = await carRepository.findModelId(model);
  if (!modelData) throw new Error('존재하지 않는 차 모델입니다.');

  const createCar = await carRepository.createCar({
    ...rest,
    explanation: rest.explanation ?? null,
    accidentDetails: rest.accidentDetails ?? null,
    // company: { connect: { id: user.companyId } }, // ← 이 방식
    manufacturerId: manufacturerData.id,
    model: {
      connect: {
        id: modelData.id,
      },
    },
    carStatus: CarStatus.POSSESSION,
  });
  return {
    id: createCar.id,
    carNumber: createCar.carNumber,
    manufacturer: manufacturerData.name,
    model: modelData.name,
    type: modelData.type,
    manufacturingYear: createCar.manufacturingYear,
    mileage: createCar.mileage,
    price: createCar.price,
    accidentCount: createCar.accidentCount,
    explanation: createCar.explanation,
    accidentDetails: createCar.accidentDetails,
  };
}
