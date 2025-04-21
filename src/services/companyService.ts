import * as companyRepository from '../repositories/companyRepository';
import { CreateCompanyDTO, CompanyResponseDTO } from '../dto/companyDto';

export const createCompany = async (dto: CreateCompanyDTO) => {
  const { companyName, companyCode } = dto;
  const existingCompanyName = await companyRepository.getByCompanyName(companyName);
  const existingCompanyCode = await companyRepository.getByCompanyCode(companyCode);
  if (existingCompanyCode || existingCompanyName) {
    // throw new ConflictError('CompanyCode or ComapnyName already exists.');
    // ConflictError는 user 만들다가 이미 추가해두었기 때문에 이 브랜치에서는 따로 추가하지 않아서 오류가 날 뿐입니다요..
  }
  const createdCompany = await companyRepository.create(dto);
  const company = new CompanyResponseDTO(createdCompany, 0);
  return company;
};
