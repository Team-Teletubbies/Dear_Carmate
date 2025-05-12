import { Company, CompanyWithCount } from '../types/companyType';

export interface CreateUpdateCompanyDTO {
  companyName: string;
  companyCode: string;
}

export interface GetCompanyListDTO {
  page: number;
  pageSize: number;
  searchBy?: string;
  keyword?: string;
}

export class CompanyResponseDTO {
  id: number;
  companyName: string;
  companyCode: string;
  userCount: number;

  constructor(company: CompanyWithCount | Company) {
    this.id = company.id;
    this.companyName = company.companyName;
    this.companyCode = company.companyCode;

    this.userCount =
      '_count' in company && company._count?.users !== undefined ? company._count.users : 0;
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
