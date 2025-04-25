import * as carRepository from '../repositories/carRepository';
import { CarType } from '../types/carType';
import {
  CarCsvRow,
  CarRegisterRequestDTO,
  carRegistUpdateDTO,
  GetCarListDTO,
  mapCarDTO,
} from '../dto/carDTO';
import NotFoundError from '../lib/errors/notFoundError';
import { mapCarStatus } from '../structs/carStruct';
import fs from 'fs';
import csv from 'csv-parser';

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

export async function carCsvUpload(filePath: string, companyId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const errors: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row: CarCsvRow) => {
        try {
          await carRepository.carCsvUpload(row, companyId);
        } catch (err) {
          console.error('등록 오류:', row, err);

          if (err instanceof Error) {
            // TypeScript에서 catch 블록 내의 err는 기본적으로 unknown 타입 안전하게 .message 프로퍼티에 접근하려면 instanceof Error로 먼저 타입 검사를 해줘야함
            errors.push({ row, error: err.message }); // err가 Error 타입일 경우, .message를 꺼내서 errors 배열에 저장, 나중에 전체 처리 결과에 실패 목록을 함께 리턴
          } else {
            errors.push({ row, error: '알 수 없는 오류' }); // 만약 err가 Error 타입이 아니라면 (ex: 문자열, 객체, 숫자 등), '알 수 없는 오류'로 처리
          }
        }
      })
      .on('end', () => {
        console.log('CSV 파일 처리 완료');
        resolve();
      })
      .on('error', (err) => {
        console.error('CSV 파일 처리 중 오류 발생:', err);
        reject(err);
      });
  });
}
