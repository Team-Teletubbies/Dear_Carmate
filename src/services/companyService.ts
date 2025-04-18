import * as companyRepository from '../repositories/companyRepository';
import { CreateCompanyDTO, CompanyResponseDTO } from '../dto/companyDto';

export const createCompany = async (dto: CreateCompanyDTO) => {
  const createdCompany = await companyRepository.create(dto);
  const company = new CompanyResponseDTO(createdCompany, 0);
  return company;
};
