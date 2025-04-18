import { Gender, AgeGroup, Region } from '@prisma/client';

export interface CreateCustomerDTO {
  name: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup?: AgeGroup;
  region?: Region;
  email: string;
  memo?: string;
}

export interface UpdateCustomerDTO {
  name: string;
  gender: Gender;
  phoneNumber: string;
  ageGroup?: AgeGroup;
  region?: Region;
  email: string;
}
