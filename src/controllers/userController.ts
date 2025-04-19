import { RequestHandler } from 'express';
import * as userService from '../services/userService';
import { CreateUserDTO } from '../dto/userDTO';
import BadRequestError from '../lib/errors/badRequestError';
import { assert } from 'superstruct';
import { createUserBodyStruct, registerUserStruct } from '../structs/userStruct';

export const createUser: RequestHandler = async (req, res) => {
  assert(req.body, registerUserStruct);
  // Todo: 여기서 오류 시 어떤 오류 던지는지, 잘 잡히는지 체크
  const { passwordConfirmation, ...rest } = req.body;
  const dto: CreateUserDTO = rest;
  const user = await userService.createUser(dto);
  res.status(201).json(user);
};
