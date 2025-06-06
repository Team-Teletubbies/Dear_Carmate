import * as carRepository from '../repositories/carRepository';
import {
  CarCsvRow,
  CarRegisterRequestDTO,
  CarRegistUpdateDTO,
  GetCarParamsDTO,
  GetManufacturerModelListResponseDTO,
  ManufacturerModelDTO,
  mapCarDTO,
} from '../dto/carDTO';
import NotFoundError from '../lib/errors/notFoundError';
import { mapCarStatus } from '../lib/utils/carStatus';
import fs from 'fs';
import csv from 'csv-parser';

async function validManufacturerAndModel(manufacturer: string, model: string) {
  const manufacturerData = await carRepository.findManufacturerId(manufacturer);
  if (!manufacturerData) throw new NotFoundError('존재하지 않는 제조사입니다');

  const modelData = await carRepository.findModelId(model, manufacturerData.id);
  if (!modelData) throw new NotFoundError('존재하지 않는 차량 모델입니다');

  return { manufacturerData, modelData };
}

function commonCarData(rest: Partial<CarRegistUpdateDTO>, modelId: number, companyId: number) {
  const data: any = {
    ...rest,
    explanation: rest.explanation ?? null,
    accidentDetails: rest.accidentDetails ?? null,
    model: {
      connect: { id: modelId },
    },
    company: {
      connect: { id: companyId },
    },
  };

  if (rest.status) {
    data.carStatus = mapCarStatus(rest.status);
  }
  delete data.status;
  return data;
}

function carResponseDTO(car: any, manufacturerData: any, modelData: any): CarRegistUpdateDTO {
  return mapCarDTO({
    ...car,
    status: car.carStatus,
    manufacturer: { name: manufacturerData.name },
    model: { name: modelData.name, type: modelData.type },
  });
}

export const registerCar = async function (
  data: CarRegisterRequestDTO,
  companyId: number,
): Promise<CarRegistUpdateDTO> {
  const { manufacturer, model, carStatus, ...rest } = data;

  const { manufacturerData, modelData } = await validManufacturerAndModel(manufacturer, model);
  const carData = commonCarData(
    {
      ...rest,
      status: mapCarStatus(carStatus) as CarRegistUpdateDTO['status'],
    },
    modelData.id,
    companyId,
  );
  const createdCar = await carRepository.createCar(carData);

  return carResponseDTO(createdCar, manufacturerData, modelData);
};

export const updateCar = async function (
  id: number,
  data: Partial<CarRegisterRequestDTO>,
  companyId: number,
): Promise<CarRegistUpdateDTO> {
  const { manufacturer, model, carStatus, ...rest } = data;

  const existingCar = await carRepository.findCarById(id);
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다');

  if (!manufacturer || !model) {
    throw new Error('manufacturer와 model은 필수입니다');
  }

  const { manufacturerData, modelData } = await validManufacturerAndModel(
    manufacturer as string,
    model as string,
  );
  if (!carStatus) throw new Error('carStatus는 필수입니다');
  const carData = commonCarData(
    {
      ...rest,
      status: mapCarStatus(carStatus) as CarRegistUpdateDTO['status'],
    },
    modelData.id,
    companyId,
  );
  const updatedCar = await carRepository.updateCar(id, carData);

  return carResponseDTO(updatedCar, manufacturerData, modelData);
};

export const deleteCar = async function (id: number): Promise<void> {
  const existingCar = await carRepository.findCarById(id);
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다');

  await carRepository.deleteCar(id);
};

export const getCarList = async function (
  data: GetCarParamsDTO,
  companyId: number,
): Promise<{ totalCount: number; cars: CarRegistUpdateDTO[] }> {
  const { totalCount, carList } = await carRepository.getCarList(data, companyId);

  const cars = carList.map((car) =>
    mapCarDTO({
      ...car,
      carStatus: car.carStatus,
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
};

export const getCarById = async function (id: number): Promise<CarRegistUpdateDTO> {
  const car = await carRepository.getCarById(id);
  if (!car) throw new NotFoundError('존재하지 않는 차량입니다');

  return mapCarDTO({
    ...car,
    carStatus: car.carStatus,
    manufacturer: {
      name: car.model.manufacturer.name,
    },
    model: {
      name: car.model.name,
      type: car.model.type,
    },
  });
};

export const getManufacturerModelList =
  async function (): Promise<GetManufacturerModelListResponseDTO> {
    const data = await carRepository.getManufacturerModelList();
    if (!data) throw new NotFoundError('제조사 및 모델 정보가 없습니다');

    const dataList: ManufacturerModelDTO[] = data.map((manufacturer) => ({
      manufacturer: manufacturer.name,
      model: manufacturer.models.map((model) => model.name),
    }));

    return { data: dataList };
  };

interface CsvUploadError {
  row: CarCsvRow;
  error: string;
}

export const carCsvUpload = async function (
  filePath: string,
  companyId: number,
): Promise<CsvUploadError[]> {
  const concurrencyLimit = 5;
  let running = 0;
  let resolveEnd: () => void;
  const endPromise = new Promise<void>((resolve) => (resolveEnd = resolve));
  const errors: CsvUploadError[] = [];
  const queue: (() => Promise<void>)[] = [];

  const next = () => {
    while (running < concurrencyLimit && queue.length) {
      const task = queue.shift()!;
      running++;
      task()
        .catch(() => {})
        .finally(() => {
          running--;
          if (queue.length === 0 && running === 0) {
            resolveEnd();
          } else {
            next();
          }
        });
    }
  };

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row: CarCsvRow) => {
      queue.push(async () => {
        try {
          await carRepository.carCsvUpload(row, companyId);
        } catch (err) {
          console.error('등록 오류:', row, err);
          const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
          errors.push({ row, error: errorMessage });
          throw err;
        }
      });
      next();
    })
    .on('end', () => {
      if (queue.length === 0 && running === 0) {
        resolveEnd();
      }
    })
    .on('error', (err) => {
      console.error('CSV 파일 처리 중 스트림 오류 발생:', err);
      resolveEnd();
    });

  await endPromise;
  console.log('CSV 파일 처리 완료');
  return errors;
};
