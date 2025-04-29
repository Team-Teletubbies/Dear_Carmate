import { Request, Response } from 'express';
import * as carService from '../services/carService';
import { carFilterStruct, createCarBodyStruct, updateCarBodyStruct } from '../structs/carStruct';
import { create } from 'superstruct';
import { SearchField } from '../dto/carDTO';
import { IdParamsStruct } from '../structs/commonStruct';

export const registerCar = async (req: Request, res: Response): Promise<void> => {
  const data = create(req.body, createCarBodyStruct);

  if (!req.user) {
    res.status(401).json({ message: '로그인 정보가 없습니다.' });
  }
  const companyId = (req.user as { companyId: number }).companyId;

  if (!companyId) throw new Error('companyId는 필수입니다.');

  const registerCars = await carService.registerCar(data, companyId);
  res.status(201).json(registerCars);
};

export const updateCar = async (req: Request, res: Response): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, updateCarBodyStruct);

  if (!req.user) {
    res.status(401).json({ message: '로그인 정보가 없습니다.' });
  }
  const companyId = (req.user as { companyId: number }).companyId;

  if (!companyId) throw new Error('companyId는 필수입니다.');
  const updatedCar = await carService.updateCar(Number(id), data, companyId);
  res.status(200).json(updatedCar);
};

export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  const { id } = create(req.params, IdParamsStruct);

  await carService.deleteCar(Number(id));
  res.status(204).send();
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
    // 별도 과정없이 직관적으로 정보를 확인하기 좋아서 권장됨...
    totalCount: carList.totalCount,
    page,
    pageSize,
    cars: carList.cars,
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
  const path = req.file?.path;
  if (!path) {
    res.status(400).json({ message: '파일이 없습니다.' });
    return;
  }

  const companyId = req.user?.companyId;
  if (!companyId) {
    res.status(400).json({ message: '회사 ID가 없습니다.' });
    return;
  }
  await carService.carCsvUpload(path, companyId);
  res.json({ message: 'CSV 업로드 및 차량 등록 완료' });
};
