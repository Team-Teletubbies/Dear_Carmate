import { CreateCustomerDTO, UpdateCustomerDTO } from '../../../dto/customer.dto';
import { toGenderEnum, toAgeGroupEnum, toRegionEnum } from './customerEnumConverter';

export function convertCreateCustomerInput(input: unknown): CreateCustomerDTO {
  const { name, gender, phoneNumber, ageGroup, region, email, memo } = input as Record<
    string,
    string
  >;
  return {
    name,
    gender: toGenderEnum(gender),
    phoneNumber,
    ageGroup: ageGroup ? toAgeGroupEnum(ageGroup) : undefined,
    region: region ? toRegionEnum(region) : undefined,
    email,
    memo,
  };
}

export function convertUpdateCustomerInput(input: unknown): UpdateCustomerDTO {
  const { name, gender, phoneNumber, ageGroup, region, email, memo } = input as Record<
    string,
    string
  >;
  return {
    name,
    gender: toGenderEnum(gender),
    phoneNumber,
    ageGroup: ageGroup ? toAgeGroupEnum(ageGroup) : undefined,
    region: region ? toRegionEnum(region) : undefined,
    email,
    memo,
  };
}
