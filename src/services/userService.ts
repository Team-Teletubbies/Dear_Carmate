import { CreateUserDTO, UserResponseDTO } from '../dto/userDTO';
import * as userRepository from '../repositories/userRepository';
import * as companyRepository from '../repositories/companyReposiotry'; // companyRepository에서 findValidateCompany잊지않고 만들어야 한다..
import NotFoundError from '../lib/errors/notFoundError';
import { hashPassword } from '../lib/auth/hash';
import ConflictError from '../lib/errors/conflictError';
import { CreateUserInput } from '../types/userType';

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
