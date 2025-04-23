import {
  CreateUserDTO,
  GetUserListDTO,
  GetUserListResponseDTO,
  LoginDTO,
  LoginResponseDTO,
  UserResponseDTO,
} from '../dto/userDTO';
import * as userRepository from '../repositories/userRepository';
import * as companyRepository from '../repositories/companyRepository';
import NotFoundError from '../lib/errors/notFoundError';
import { hashPassword } from '../lib/auth/hash';
import ConflictError from '../lib/errors/conflictError';
import { CreateUserInput, UserWithPasswordAndCompany } from '../types/userType';
import bcrypt from 'bcrypt';
import { createToken } from '../lib/auth/jwt';
import { redis } from '../lib/auth/redis';

export const createUser = async (dto: CreateUserDTO) => {
  const { email, employeeNumber, company, companyCode, password, ...rest } = dto;
  // Refactor? 함수화 : validateCompany
  const validCompany = await companyRepository.findValidateCompany(company, companyCode);
  if (!validCompany) {
    throw new NotFoundError('Company info is invalid.');
  }
  const companyId = validCompany.id;
  // Refactor? 함수화 : checkDuplicateUser
  const existingEmail = await userRepository.getByEmail(email);
  const existingEmployeeNumber = await userRepository.getByEmployeeNumber(employeeNumber);
  if (existingEmail || existingEmployeeNumber) {
    throw new ConflictError('Email or EmployeeNumber already exists.');
  }
  const hashedPassword = await hashPassword(password);
  const input: CreateUserInput = {
    ...rest,
    email,
    employeeNumber,
    password: hashedPassword,
    companyId,
  };
  const user = await userRepository.create(input);
  const userWithCompanyCode: UserResponseDTO = await userRepository.getWithCompanyCode(user.id);
  return userWithCompanyCode;
};

export const getUserList = async (dto: GetUserListDTO) => {
  const input = { ...dto, searchBy: dto.searchBy ?? 'name' };
  const userList = await userRepository.getUserList(input);
  const { page, pageSize, searchBy, keyword } = input;
  const currentPage = page;
  const totalItemCount = await userRepository.countByKeyword(searchBy, keyword);
  const totalPages = Math.ceil(totalItemCount / pageSize);
  const result = new GetUserListResponseDTO(userList, currentPage, totalPages, totalItemCount);
  return result;
};

export const login = async (dto: LoginDTO): Promise<LoginResponseDTO> => {
  const { email, password } = dto;
  const user = await userRepository.findForLoginByEmail(email);
  if (!user) {
    throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
  }
  const accessToken = createToken(user);
  const refreshToken = createToken(user, 'refresh');
  const userId = user.id;
  await redis.set(`refresh:user:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 14);
  const result = new LoginResponseDTO(user, { accessToken, refreshToken });
  return result;
};
