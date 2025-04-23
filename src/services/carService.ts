import * as carRepository from '../repositories/carRepository';
import { CarType } from '../types/carType';
import { CarRegisterRequestDTO, carRegistUpdateDTO, GetCarListDTO, mapCarDTO } from '../dto/carDTO';
import NotFoundError from '../lib/errors/notFoundError';
import { mapCarStatus } from '../structs/carStruct';

async function validManufacturerAndModel(manufacturer: string, model: string, carNumber: string) {
  const manufacturerData = await carRepository.findManufacturerId(manufacturer);
  if (!manufacturerData) throw new NotFoundError('존재하지 않는 제조사입니다.');

  const modelData = await carRepository.findModelId(model, manufacturerData.id);
  if (!modelData) throw new NotFoundError('존재하지 않는 차량 모델입니다.');

  const existingCarData = await carRepository.getCarByCarNumber(carNumber);
  if (existingCarData) throw new NotFoundError('이미 등록된 차량 번호입니다.');

  return { manufacturerData, modelData, existingCarData };
}

function commonCarData(
  rest: Partial<CarType>,
  manufacturerId: number,
  modelId: number,
  companyId: number,
) {
  const data: any = {
    ...rest,
    explanation: rest.explanation ?? null,
    accidentDetails: rest.accidentDetails ?? null,
    manufacturerId,
    model: {
      connect: { id: modelId },
    },
    company: {
      connect: { id: companyId },
    },
  };

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
  data: CarRegisterRequestDTO,
  companyId: number,
): Promise<carRegistUpdateDTO> {
  const { manufacturer, model, carNumber, carStatus, ...rest } = data;

  const { manufacturerData, modelData } = await validManufacturerAndModel(
    manufacturer,
    model,
    carNumber,
  );
  if (!carStatus) throw new Error('carStatus는 필수입니다.');

  const carData = commonCarData(
    {
      ...rest,
      carNumber,
      carStatus: mapCarStatus(carStatus) as CarType['carStatus'],
    },
    manufacturerData.id,
    modelData.id,
    companyId,
  );
  const createdCar = await carRepository.createCar(carData);

  return carResponseDTO(createdCar, manufacturerData, modelData);
}

export async function updateCar(
  id: number,
  data: Partial<CarType>,
  companyId: number,
): Promise<carRegistUpdateDTO> {
  const { manufacturer, model, carNumber, carStatus, ...rest } = data;

  const existingCar = await carRepository.findCarById(id);
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다.');

  const { manufacturerData, modelData } = await validManufacturerAndModel(
    manufacturer as string,
    model as string,
    carNumber as string,
  );
  if (!carStatus) throw new Error('carStatus는 필수입니다.');

  const carData = commonCarData(
    {
      ...rest,
      carNumber,
      carStatus: mapCarStatus(carStatus) as CarType['carStatus'],
    },
    manufacturerData.id,
    modelData.id,
    companyId,
  );
  const updatedCar = await carRepository.updateCar(id, carData);

  return carResponseDTO(updatedCar, manufacturerData, modelData);
}

export async function deleteCar(id: number): Promise<void> {
  const existingCar = await carRepository.findCarById(id);
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다.');

  await carRepository.deleteCar(id);
}

export async function getCarList(
  data: GetCarListDTO,
): Promise<{ totalCount: number; cars: carRegistUpdateDTO[] }> {
  const { totalCount, carList } = await carRepository.getCarList(data);

  const cars = carList.map((car) =>
    mapCarDTO({
      ...car,
      manufacturer: {
        name: car.model.manufacturer.name,
      },
      model: {
        name: car.model.name,
        type: car.model.type,
      },
    }),
  );

  return {
    totalCount,
    cars,
  };
}

export async function getCarById(id: number): Promise<carRegistUpdateDTO> {
  const car = await carRepository.getCarById(id);
  if (!car) throw new NotFoundError('존재하지 않는 차량입니다.');

  return mapCarDTO({
    ...car,
    manufacturer: {
      name: car.model.name,
    },
    model: {
      name: car.model.name,
      type: car.model.type,
    },
  });
}

export async function getManufacturerModelList() {
  const data = await carRepository.getManufacturerModelList();
  if (!data) throw new NotFoundError('제조사 및 모델 정보가 없습니다.');

  return data.map((m) => ({
    manufacturer: m.name,
    model: m.models.map((model) => model.name),
  }));
}
