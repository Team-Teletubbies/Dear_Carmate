import { Prisma } from '@prisma/client';
import { UserSearchKey } from '../structs/userStruct';

// Entity

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

// Types

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
