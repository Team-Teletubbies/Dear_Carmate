import * as companyRepository from '../repositories/companyRepository';
import {
  CreateCompanyDTO,
  CompanyResponseDTO,
  GetCompanyListDTO,
  CompanyListResponseDTO,
} from '../dto/companyDto';
import ConflictError from '../lib/errors/conflictError';

export const createCompany = async (dto: CreateCompanyDTO) => {
  const { companyName, companyCode } = dto;
  const existingCompanyName = await companyRepository.getByCompanyName(companyName);
  const existingCompanyCode = await companyRepository.getByCompanyCode(companyCode);
  if (existingCompanyCode || existingCompanyName) {
    throw new ConflictError('CompanyCode or ComapnyName already exists.');
  }
  const createdCompany = await companyRepository.create(dto);
  const company = new CompanyResponseDTO(createdCompany);
  return company;
};

export const getCompanyList = async (dto: GetCompanyListDTO) => {
  const input = {
    ...dto,
    searchBy: dto.searchBy ?? 'companyName',
  };
  const companyList = await companyRepository.getCompanyListWithUserCount(input);
  const companyListWithUserCount = companyList.map((company) => {
    return new CompanyResponseDTO(company);
  });
  const { page, pageSize, searchBy, keyword } = input;
  const currentPage = page;
  const totalItemCount = await companyRepository.countByKeyword(searchBy, keyword);
  const totalPages = Math.ceil(totalItemCount / pageSize);
  const result = new CompanyListResponseDTO(
    companyListWithUserCount,
    currentPage,
    totalPages,
    totalItemCount,
  );
  return result;
};
