import { Request, Response } from 'express';
import * as userService from '../services/userService';
import {
  CreateUserDTO,
  GetUserListDTO,
  LoginDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
  updateMyInfoDTO,
  UserProfileResponseDTO,
} from '../dto/userDTO';
import BadRequestError from '../lib/errors/badRequestError';
import { assert, create } from 'superstruct';
import {
  createUserBodyStruct,
  loginBodyStruct,
  refreshTokenBodyStruct,
  updateUserBodyStruct,
  userFilterStruct,
} from '../structs/userStruct';
import { IdParamsStruct } from '../structs/commonStruct';
import { AuthenticatedRequest } from '../types/express';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  assert(req.body, createUserBodyStruct);
  if (req.body.password !== req.body.passwordConfirmation) {
    throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다');
  }
  const { passwordConfirmation, ...rest } = req.body;
  const dto: CreateUserDTO = rest;
  const user = await userService.createUser(dto);
  res.status(201).json(user);
};

export const getUserList = async (req: AuthenticatedRequest, res: Response) => {
  const dto: GetUserListDTO = create(req.query, userFilterStruct);
  const userList = await userService.getUserList(dto);
  res.status(200).json(userList);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const dto: LoginDTO = create(req.body, loginBodyStruct);
  const user = await userService.login(dto);
  res.status(200).json(user);
};

export const refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { refreshToken } = create(req.body, refreshTokenBodyStruct);
  const userId = req.user!.userId;
  const dto: RefreshTokenDTO = { refreshToken, userId };
  const newTokens: RefreshTokenResponseDTO = await userService.refreshToken(dto);
  res.status(200).json(newTokens);
};

export const getMyInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { userId } = req.user;
  const user: UserProfileResponseDTO = await userService.getMyInfo(userId);
  res.status(200).json(user);
};

export const updateMyInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  assert(req.body, updateUserBodyStruct);
  if (req.body.password !== req.body.passwordConfirmation) {
    throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다');
  }
  const { passwordConfirmation, ...rest } = req.body;
  const data: updateMyInfoDTO = rest;
  const { userId } = req.user;
  const user: UserProfileResponseDTO = await userService.updateMyInfo(userId, data);
  res.status(200).json(user);
};

export const deleteMyAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { userId } = req.user;
  await userService.deleteMyAccount(userId);
  res.status(200).json({ message: '유저 삭제 성공' });
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id: userId } = create(req.params, IdParamsStruct);
  await userService.deleteUser(userId);
  res.status(200).json({ message: '유저 삭제 성공' });
};
