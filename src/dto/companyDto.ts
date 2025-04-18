import { Company } from '../types/companyType';

// Request
export interface CreateCompanyDTO {
  companyName: string;
  companyCode: string;
}

// Response
export class CompanyResponseDTO {
  id: number;
  companyName: string;
  companyCode: string;
  userCount: number;

  constructor(company: Company, userCount: number) {
    this.id = company.id;
    this.companyName = company.companyName;
    this.companyCode = company.companyCode;
    this.userCount = userCount;
  }
}
