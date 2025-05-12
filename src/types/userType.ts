import { UserSearchKey } from '../structs/userStruct';

export interface User {
  id: number;
  companyId: number;
  name: string;
  email: string;
  password: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithCompanyCode {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string | null;
  isAdmin: boolean;
  company: {
    companyCode: string;
  };
}

export type UserWithPasswordAndCompany = {
  id: number;
  name: string;
  email: string;
  password: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string | null;
  isAdmin: boolean;
  company: { id: number; companyCode: string };
};

export interface CreateUserInput {
  email: string;
  employeeNumber: string;
  password: string;
  companyId: any;
  name: string;
  phoneNumber: string;
}

export interface GetUserListInput {
  page: number;
  pageSize: number;
  searchBy: UserSearchKey;
  keyword?: string;
}

export interface TokenPayload {
  userId: number;
  companyId: number;
}

export interface updateMyInfoInput {
  employeeNumber: string;
  phoneNumber: string;
  password?: string;
  imageUrl: string | null;
}
