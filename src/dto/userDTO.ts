import { UserWithCompanyCode } from '../types/userType';
// Request

export interface CreateUserDTO {
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  company: string;
  companyCode: string;
}

// Response
export type UserResponseDTO = UserWithCompanyCode;
