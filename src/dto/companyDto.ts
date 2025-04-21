import { Company, CompanyWithCount } from '../types/companyType';

// Request
export interface CreateCompanyDTO {
  companyName: string;
  companyCode: string;
}

export interface GetCompanyListDTO {
  page: number;
  pageSize: number;
  searchBy?: string;
  keyword?: string;
}

// Response

export class CompanyResponseDTO {
  id: number;
  companyName: string;
  companyCode: string;
  userCount: number;

  constructor(company: Company | CompanyWithCount) {
    this.id = company.id;
    this.companyName = company.companyName;
    this.companyCode = company.companyCode;
    this.userCount = (company as CompanyWithCount)._count.users ?? 0;
  }
}

export class CompanyListResponseDTO {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: CompanyResponseDTO[];

  constructor(
    companies: CompanyResponseDTO[],
    currentPage: number,
    totalPages: number,
    totalItemCount: number,
  ) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.totalItemCount = totalItemCount;
    this.data = companies;
  }
}
