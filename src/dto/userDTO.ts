import { UserWithCompanyCode, UserWithPasswordAndCompany } from '../types/userType';
import { UserSearchKey } from '../structs/userStruct';

// Request
export interface CreateUserDTO {
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  companyName: string;
  companyCode: string;
}

export interface GetUserListDTO {
  page: number;
  pageSize: number;
  searchBy?: UserSearchKey;
  keyword?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  userId: number;
  refreshToken: string;
}

export interface updateMyInfoDTO {
  employeeNumber: string;
  currentPassword: string;
  phoneNumber: string;
  password?: string;
  imageUrl: string | null;
}

// Response
export type UserResponseDTO = UserWithCompanyCode;

export class GetUserListResponseDTO {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: UserListItem[];

  constructor(
    UserList: UserListItem[],
    currentPage: number,
    totalPages: number,
    totalItemCount: number,
  ) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalItemCount = totalItemCount;
    this.data = UserList;
  }
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  company: { companyName: string };
}

export class LoginResponseDTO {
  user: {
    id: number;
    name: string;
    email: string;
    employeeNumber: string;
    imageUrl: string;
    isAdmin: boolean;
    company: { companyCode: string };
  };
  accessToken: string;
  refreshToken: string;

  constructor(
    user: UserWithPasswordAndCompany,
    tokens: { refreshToken: string; accessToken: string },
  ) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      employeeNumber: user.employeeNumber,
      imageUrl: user.imageUrl ?? '',
      isAdmin: user.isAdmin,
      company: { companyCode: user.company.companyCode },
    };
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }
}

export interface RefreshTokenResponseDTO {
  refreshToken: string;
  accessToken: string;
}

export class UserProfileResponseDTO {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string;
  isAdmin: boolean;
  company: { companyCode: string };

  constructor(user: UserWithCompanyCode) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.employeeNumber = user.employeeNumber;
    this.phoneNumber = user.phoneNumber;
    this.imageUrl = user.imageUrl ?? '';
    this.isAdmin = user.isAdmin;
    this.company = user.company;
  }
}
