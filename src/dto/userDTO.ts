import { UserWithCompanyCode } from '../types/userType';
import { UserListParams } from '../structs/userStruct';
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

export interface GetUserListDTO {
  page: number;
  pageSize: number;
  searchBy?: UserListParams;
  keyword?: string;
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
