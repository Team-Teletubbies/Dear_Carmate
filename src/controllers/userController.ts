import { RequestHandler } from 'express';
import * as userService from '../services/userService';
import { CreateUserDTO } from '../dto/userDTO';
import BadRequestError from '../lib/errors/badRequestError';
import { create } from 'superstruct';

export const createUser: RequestHandler = async (req, res) => {
  // Todo: CreateUserBodyStruct 개발 필요
  const userInput = create(req.body, CreateUserBodyStruct);
  if (userInput.password !== userInput.passwordConfirmation) {
    throw new BadRequestError('Password confirmation does not match the password.');
  }
  const { passwordConfirmation, ...rest } = userInput;
  const dto: CreateUserDTO = rest;
  const user = await userService.createUser(dto);
  res.status(201).json(user);
};
