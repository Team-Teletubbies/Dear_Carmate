import { Request, Response } from 'express';
import * as carService from '../services/carService';
import {
  carFilterStruct,
  createCarBodyStruct,
  mapCreateCarError,
  updateCarBodyStruct,
} from '../structs/carStruct';
import { create, StructError } from 'superstruct';
import { SearchField } from '../dto/carDTO';
import { IdParamsStruct } from '../structs/commonStruct';

export const registerCar = async (req: Request, res: Response): Promise<void> => {
  let data;
  try {
    data = create(req.body, createCarBodyStruct);
  } catch (error) {
    const structError = error as StructError;
    const errorMessage = mapCreateCarError(structError);
    res.status(400).json({ message: errorMessage });
    return;
  }

  const companyId = (req.user as { companyId: number }).companyId;

  const registerCars = await carService.registerCar(data, companyId);
  res.status(201).json(registerCars);
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
  let id: number;
  let data: any;

  try {
    id = create(req.params, IdParamsStruct).id;
    data = create(req.body, updateCarBodyStruct);
  } catch (error) {
    const structError = error as StructError;
    const errorMessage = mapCreateCarError(structError);
    res.status(400).json({ message: errorMessage });
    return;
  }

  const companyId = (req.user as { companyId: number }).companyId;

  const updatedCar = await carService.updateCar(Number(id), data, companyId);
  res.status(200).json(updatedCar);
};

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);

  await carService.deleteCar(Number(id));
  res.status(200).send({ message: '차량 삭제 성공' });
};

export const getCarList = async (req: Request, res: Response): Promise<void> => {
  const { page, pageSize, searchBy, keyword } = create(req.query, carFilterStruct);

  const carList = await carService.getCarList({
    page,
    pageSize,
    searchBy: searchBy as SearchField,
    keyword,
  });

  res.status(200).json({
    currentPage: page,
    totalPages: Math.round(carList.totalCount / pageSize),
    totalCount: carList.totalCount,
    data: carList.cars,
  });
};

export const getCarDetail = async (req: Request, res: Response): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);

  const car = await carService.getCarById(Number(id));
  res.status(200).json(car);
};

export const getManufacturerModelList = async (req: Request, res: Response): Promise<void> => {
  const data = await carService.getManufacturerModelList();
  res.status(200).json(data);
};

export const carCsvUpload = async (req: Request, res: Response): Promise<void> => {
  const path = req.file!.path;

  const companyId = (req.user as { companyId: number }).companyId;

  await carService.carCsvUpload(path, companyId);
  res.json({ message: 'CSV 업로드 및 차량 등록 완료' });
};
