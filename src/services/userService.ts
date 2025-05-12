import {
  CreateUserDTO,
  GetUserListDTO,
  GetUserListResponseDTO,
  LoginDTO,
  LoginResponseDTO,
  RefreshTokenDTO,
  RefreshTokenResponseDTO,
  updateMyInfoDTO,
  UserProfileResponseDTO,
} from '../dto/userDTO';
import * as userRepository from '../repositories/userRepository';
import * as companyRepository from '../repositories/companyRepository';
import NotFoundError from '../lib/errors/notFoundError';
import { hashPassword } from '../lib/auth/hash';
import ConflictError from '../lib/errors/conflictError';
import { CreateUserInput } from '../types/userType';
import bcrypt from 'bcrypt';
import { createToken } from '../lib/auth/jwt';
import BadRequestError from '../lib/errors/badRequestError';

export const createUser = async (dto: CreateUserDTO): Promise<UserProfileResponseDTO> => {
  const { email, employeeNumber, companyName, companyCode, password, ...rest } = dto;
  const companyId = await validateCompany(companyName, companyCode);
  await checkDuplicateUser(email, employeeNumber);
  const hashedPassword = await hashPassword(password);
  const input: CreateUserInput = {
    ...rest,
    email,
    employeeNumber,
    password: hashedPassword,
    companyId,
  };
  const user = await userRepository.create(input);
  return new UserProfileResponseDTO(user);
};

export const getUserList = async (dto: GetUserListDTO): Promise<GetUserListResponseDTO> => {
  const searchBy = dto.searchBy ?? 'name';
  const { page, pageSize, keyword } = dto;
  const userList = await userRepository.getUserList({ ...dto, searchBy });
  const totalItemCount = await userRepository.countByKeyword(searchBy, keyword);
  const totalPages = Math.ceil(totalItemCount / pageSize);
  return new GetUserListResponseDTO(userList, page, totalPages, totalItemCount);
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
  const userId = user.id;
  const companyId = user.company.id;
  const tokens = await createTokens(userId, companyId);
  return new LoginResponseDTO(user, tokens);
};

export const refreshToken = async (dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> => {
  const { userId, refreshToken } = dto;
  const original = await userRepository.getRedisRefreshToken(refreshToken);
  if (!original) {
    throw new BadRequestError('잘못된 요청입니다.');
  }
  const user = await userRepository.getById(userId);
  if (!user) {
    throw new NotFoundError('존재하지 않는 유저입니다');
  }
  const companyId = user.companyId;
  return await createTokens(userId, companyId);
};

export const getMyInfo = async (userId: number): Promise<UserProfileResponseDTO> => {
  const userProfile = await userRepository.getWithCompanyCode(userId);
  if (!userProfile) {
    throw new NotFoundError('존재하지 않는 유저입니다');
  }
  return new UserProfileResponseDTO(userProfile);
};

export const updateMyInfo = async (
  userId: number,
  data: updateMyInfoDTO,
): Promise<UserProfileResponseDTO> => {
  const { currentPassword, ...dataWithoutCurrentPassword } = data;
  const user = await userRepository.getById(userId);
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw new BadRequestError('현재 비밀번호가 맞지 않습니다');
  }
  if (data.password) {
    const hashedPassword = await hashPassword(data.password);
    dataWithoutCurrentPassword.password = hashedPassword;
  }
  const updated = await userRepository.updateAndGetUser(userId, dataWithoutCurrentPassword);
  return new UserProfileResponseDTO(updated);
};

export const deleteMyAccount = async (userId: number): Promise<void> => {
  const deleted = await userRepository.deleteById(userId);
  if (!deleted) {
    throw new NotFoundError('유저를 찾지 못했습니다');
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  const deleted = await userRepository.deleteById(userId);
  if (!deleted) {
    throw new NotFoundError('존재하지 않는 유저입니다');
  }
};

// userService 내에서 사용되는 함수

const validateCompany = async (companyName: string, companyCode: string): Promise<number> => {
  const validCompany = await companyRepository.findValidateCompany(companyName, companyCode);
  if (!validCompany) {
    throw new NotFoundError('Company info is invalid.');
  }
  return validCompany.id;
};

const checkDuplicateUser = async (email: string, employeeNumber: string) => {
  const existingEmail = await userRepository.getByEmail(email);
  const existingEmployeeNumber = await userRepository.getByEmployeeNumber(employeeNumber);
  if (existingEmail || existingEmployeeNumber) {
    throw new ConflictError('이미 존재하는 이메일 또는 사원번호 입니다');
  }
};

const createTokens = async (
  userId: number,
  companyId: number,
): Promise<{ refreshToken: string; accessToken: string }> => {
  const accessToken = createToken({ userId, companyId });
  const refreshToken = createToken({ userId, companyId }, 'refresh');
  await userRepository.setRedisRefreshToken(userId, refreshToken);
  return { refreshToken, accessToken };
};
