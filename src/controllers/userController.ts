import { Request, RequestHandler, Response } from 'express';
import * as userService from '../services/userService';
import {
  CreateUserDTO,
  GetUserListDTO,
  LoginDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
  updateMyInfoDTO,
  UserProfileDTO,
} from '../dto/userDTO';
import BadRequestError from '../lib/errors/badRequestError';
import { assert, create } from 'superstruct';
import {
  loginBodyStruct,
  refreshTokenBodyStruct,
  registerUserStruct,
  updateUserBodyStruct,
  userFilterStruct,
} from '../structs/userStruct';
import NotFoundError from '../lib/errors/notFoundError';
import UnauthorizedError from '../lib/errors/unauthorizedError';
import { IdParamsStruct } from '../structs/commonStruct';

export const createUser: RequestHandler = async (req, res) => {
  assert(req.body, registerUserStruct);
  // Todo: 여기서 오류 시 어떤 오류 던지는지, 잘 잡히는지 체크
  const { passwordConfirmation, ...rest } = req.body;
  const dto: CreateUserDTO = rest;
  const user = await userService.createUser(dto);
  res.status(201).json(user);
};

export const getUserList = async (req: Request, res: Response) => {
  const dto: GetUserListDTO = create(req.query, userFilterStruct);
  const userList = await userService.getUserList(dto);
  res.status(200).json(userList);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const dto: LoginDTO = create(req.body, loginBodyStruct);
  const user = await userService.login(dto);
  res.status(200).json(user);
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = create(req.body, refreshTokenBodyStruct);
  const userId = req.user!.userId;
  const dto: RefreshTokenDTO = { refreshToken, userId };
  const newTokens: RefreshTokenResponseDTO = await userService.refreshToken(dto);
  res.status(200).json(newTokens);
};

export const getMyInfo = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('로그인이 필요합니다');
  }
  const { userId } = req.user;
  const user: UserProfileDTO = await userService.getMyInfo(userId);
  res.status(200).json(user);
};

export const updateMyInfo = async (req: Request, res: Response): Promise<void> => {
  assert(req.body, updateUserBodyStruct);
  if (req.body.password !== req.body.passwordConfirmation) {
    throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다');
  }
  const { passwordConfirmation, ...rest } = req.body;
  const data: updateMyInfoDTO = rest;
  if (!req.user) {
    throw new UnauthorizedError('로그인이 필요합니다');
  }
  const { userId } = req.user;
  const user: UserProfileDTO = await userService.updateMyInfo(userId, data);
  res.status(200).json(user);
};

export const deleteMyAccount = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('로그인이 필요합니다');
  }
  const { userId } = req.user;
  await userService.deleteMyAccount(userId);
  res.status(200).json({ message: '유저 삭제 성공' });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id: userId } = create(req.params, IdParamsStruct);
  await userService.deleteUser(userId);
  res.status(200).json({ message: '유저 삭제 성공' });
};
