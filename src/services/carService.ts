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

async function validManufacturerAndModel(manufacturer: string, model: string) {
  const manufacturerData = await carRepository.findManufacturerId(manufacturer);
  if (!manufacturerData) throw new NotFoundError('존재하지 않는 제조사입니다');

  const modelData = await carRepository.findModelId(model, manufacturerData.id);
  if (!modelData) throw new NotFoundError('존재하지 않는 차량 모델입니다');

  return { manufacturerData, modelData };
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
  const { manufacturer, model, carStatus, ...rest } = data;

  const { manufacturerData, modelData } = await validManufacturerAndModel(manufacturer, model);
  if (!carStatus) throw new Error('carStatus는 필수입니다');

  const carData = commonCarData(
    {
      ...rest,
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
  const { manufacturer, model, carStatus, ...rest } = data;

  const existingCar = await carRepository.findCarById(id);
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다');

  const { manufacturerData, modelData } = await validManufacturerAndModel(
    manufacturer as string,
    model as string,
  );
  if (!carStatus) throw new Error('carStatus는 필수입니다');

  const carData = commonCarData(
    {
      ...rest,

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
  if (!existingCar) throw new NotFoundError('존재하지 않는 차량입니다');

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
  if (!car) throw new NotFoundError('존재하지 않는 차량입니다');

  return mapCarDTO({
    ...car,
    manufacturer: {
      name: car.model.manufacturer.name,
    },
    model: {
      name: car.model.name,
      type: car.model.type,
    },
  });
}

export async function getManufacturerModelList() {
  const data = await carRepository.getManufacturerModelList();
  if (!data) throw new NotFoundError('제조사 및 모델 정보가 없습니다');

  const dataList = data.map((m) => ({
    manufacturer: m.name,
    model: m.models.map((model) => model.name),
  }));

  return { data: dataList };
}

interface CsvUploadError {
  // CSV 파일을 업로드하고 실패한 행(row)들을 반환
  row: CarCsvRow;
  error: string;
}

export async function carCsvUpload(filePath: string, companyId: number): Promise<CsvUploadError[]> {
  const concurrencyLimit = 5; // 동시 실행할 최대 작업 수 (병렬 처리시 안정화를 위해.. DB 커넥션 병목, 순서 꼬임, 에러 누락 등 비장상적인 병령처리 가능한 에러방지)
  let running = 0; // 현재 실행중인 작업 수
  let resolveEnd: () => void;
  const endPromise = new Promise<void>((resolve) => (resolveEnd = resolve)); // / Promise를 사용하여 CSV 파일 처리 완료를 기다림
  const errors: CsvUploadError[] = [];
  const queue: (() => Promise<void>)[] = []; // 대기 중인 작업 리스트, 할 일(task) 저장

  const next = () => {
    // 실행 중인 작업이 5개보다 적으면 queue에서 꺼내 실행
    while (running < concurrencyLimit && queue.length) {
      const task = queue.shift()!; // 대기 중인 작업 꺼냄
      running++;
      task()
        .catch(() => {}) // 개별 오류는 내부에서 errors에 수집하고 여기서는 무시
        .finally(() => {
          running--;
          if (queue.length === 0 && running === 0) {
            resolveEnd();
          } else {
            next(); // 끝난 후 다음 작업 실행
          }
        });
    }
  };

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row: CarCsvRow) => {
      queue.push(async () => {
        try {
          // CSV 파일의 각 행(row)을 처리하는 비동기 작업을 큐에 추가
          await carRepository.carCsvUpload(row, companyId);
        } catch (err) {
          console.error('등록 오류:', row, err);
          const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
          errors.push({ row, error: errorMessage }); // 등록 오류가 발생한 행(row)과 오류 메시지를 errors 배열에 저장
          throw err;
        }
      });
      next();
    })
    .on('end', () => {
      //	CSV 파일 다 읽으면, 아직 남은 작업이 다 끝나는지 확인
      if (queue.length === 0 && running === 0) {
        // 대기 중인 작업이 없고 실행 중인 작업도 없으면 resolve
        resolveEnd();
      }
    })
    .on('error', (err) => {
      console.error('CSV 파일 처리 중 스트림 오류 발생:', err);
      resolveEnd();
    });

  await endPromise; // CSV 파일 처리 완료를 기다림
  console.log('CSV 파일 처리 완료');
  return errors; // ✅ 실패한 row 목록 반환
}
