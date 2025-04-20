import * as carRepository from '../repositories/carRepository';
import { CarType } from '../types/carType';
import { carRegistUpdateDTO, mapCarDTO } from '../dto/carDTO';
import NotFoundError from '../lib/errors/notFoundError';

async function validManufacturerAndModel(manufacturer: string, model: string) {
  const manufacturerData = await carRepository.findManufacturerId(manufacturer);
  if (!manufacturerData) throw new NotFoundError('존재하지 않는 제조사입니다.');

  const modelData = await carRepository.findModelId(model);
  if (!modelData) throw new NotFoundError('존재하지 않는 차 모델입니다.');

  return { manufacturerData, modelData };
}

function commonCarData(
  rest: Partial<CarType>,
  manufacturerId: number,
  modelId: number,
  companyId?: number,
) {
  const data: any = {
    ...rest,
    explanation: rest.explanation ?? null,
    accidentDetails: rest.accidentDetails ?? null,
    manufacturerId,
    model: {
      connect: { id: modelId },
    },
  };

  if (companyId) {
    data.company = { connect: { id: companyId } };
  }

  return data;
}

function carResponseDTO(car: any, manufacturerData: any, modelData: any): carRegistUpdateDTO {
  return mapCarDTO({
    ...car,
    manufacturer: { name: manufacturerData.name },
    model: { name: modelData.name, type: modelData.type },
  });
}

export async function registerCar(
  data: CarType,
  // user: { companyId: number },
): Promise<carRegistUpdateDTO> {
  const { manufacturer, model, ...rest } = data;

  const { manufacturerData, modelData } = await validManufacturerAndModel(manufacturer, model);

  const carData = commonCarData(rest, manufacturerData.id, modelData.id /*user.companyId*/);
  const createdCar = await carRepository.createCar(carData);

  return carResponseDTO(createdCar, manufacturerData, modelData);
}

export async function updateCar(id: number, data: Partial<CarType>): Promise<carRegistUpdateDTO> {
  const { manufacturer, model, ...rest } = data;

  const existingCar = await carRepository.findCarById(id);
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다.');

  const { manufacturerData, modelData } = await validManufacturerAndModel(
    manufacturer as string,
    model as string,
  );

  const carData = commonCarData(rest, manufacturerData.id, modelData.id);
  const updatedCar = await carRepository.updateCar(id, carData);

  return carResponseDTO(updatedCar, manufacturerData, modelData);
}

export async function deleteCar(id: number): Promise<void> {
  const existingCar = await carRepository.findCarById(id);
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다.');

  await carRepository.deleteCar(id);
}
