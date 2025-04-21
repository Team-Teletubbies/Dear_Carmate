import { RequestHandler } from 'express';
import * as userService from '../services/userService';
import { CreateUserDTO, GetUserListDTO } from '../dto/userDTO';
import BadRequestError from '../lib/errors/badRequestError';
import { assert, create } from 'superstruct';
import { registerUserStruct, userFilterStruct } from '../structs/userStruct';

export const createUser: RequestHandler = async (req, res) => {
  assert(req.body, registerUserStruct);
  // Todo: 여기서 오류 시 어떤 오류 던지는지, 잘 잡히는지 체크
  const { passwordConfirmation, ...rest } = req.body;
  const dto: CreateUserDTO = rest;
  const user = await userService.createUser(dto);
  res.status(201).json(user);
};

export const getUserList: RequestHandler = async (req, res) => {
  const dto: GetUserListDTO = create(req.query, userFilterStruct);
  const userList = await userService.getUserList(dto);
  res.status(200).json(userList);
};
