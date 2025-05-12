import { Response } from 'express';
import * as carService from '../services/carService';
import {
  carFilterStruct,
  createCarBodyStruct,
  mapCreateCarError,
  updateCarBodyStruct,
} from '../structs/carStruct';
import { create, Struct, StructError } from 'superstruct';
import { CarRegisterRequestDTO, CarRegistUpdateDTO, SearchField } from '../dto/carDTO';
import { IdParamsStruct } from '../structs/commonStruct';
import { AuthenticatedRequest } from '../types/express';

function validateOrThrow<T>(input: unknown, struct: Struct<T>): T {
  try {
    return create(input, struct);
  } catch (error) {
    const errorMessage = mapCreateCarError(error as StructError);
    throw new Error(errorMessage);
  }
}

function getIdParam(req: AuthenticatedRequest): number {
  return create(req.params, IdParamsStruct).id;
}

function getCompanyId(req: AuthenticatedRequest): number {
  return req.user.companyId;
}

export const registerCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  let data: CarRegisterRequestDTO;

  try {
    data = validateOrThrow<CarRegisterRequestDTO>(req.body, createCarBodyStruct);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({ errorMessage });
    return;
  }

  const registerCars = await carService.registerCar(data, getCompanyId(req));
  res.status(201).json(registerCars);
};

export const updateCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  let id: number;
  let data: Partial<CarRegistUpdateDTO>;

  try {
    id = getIdParam(req);
    data = validateOrThrow<Partial<CarRegistUpdateDTO>>(req.body, updateCarBodyStruct);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(400).json({ message: errorMessage });
    return;
  }

  const updatedCar = await carService.updateCar(Number(id), data, getCompanyId(req));
  res.status(200).json(updatedCar);
};

export const deleteCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = getIdParam(req);

  await carService.deleteCar(Number(id));
  res.status(200).send({ message: '차량 삭제 성공' });
};

export const getCarList = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page, pageSize, searchBy, keyword, status } = validateOrThrow(req.query, carFilterStruct);

  const carList = await carService.getCarList(
    {
      page,
      pageSize,
      searchBy: searchBy as SearchField,
      keyword,
      status,
    },
    getCompanyId(req),
  );

  res.status(200).json({
    currentPage: page,
    totalPages: Math.round(carList.totalCount / pageSize),
    totalCount: carList.totalCount,
    data: carList.cars,
  });
};

export const getCarDetail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const id = getIdParam(req);

  const car = await carService.getCarById(Number(id));
  res.status(200).json(car);
};

export const getManufacturerModelList = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const data = await carService.getManufacturerModelList();
  res.status(200).json(data);
};

export const carCsvUpload = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const path = req.file!.path;

  await carService.carCsvUpload(path, getCompanyId(req));
  res.json({ message: 'CSV 업로드 및 차량 등록 완료' });
};
