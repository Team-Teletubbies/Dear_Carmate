import { AgeGroup, Customer, Gender, Region } from '@prisma/client';
import { genderToLabel, ageGroupToLabel, regionToLabel } from '../../../types/customerType';

export function toLabeledCustomer(customer: Customer | any) {
  return {
    ...customer,
    gender: customer.gender?.toLowerCase() || '',
    ageGroup: customer.ageGroup?.toLowerCase() ?? null,
    region: customer.region?.toLowerCase() ?? null,
    genderToLabel: customer.gender
      ? genderToLabel[customer.gender.toUpperCase() as Gender] || ''
      : '',
    ageGroupToLabel: customer.ageGroup
      ? ageGroupToLabel[customer.ageGroup.toUpperCase() as AgeGroup] || ''
      : '',
    regionToLabel: customer.region
      ? regionToLabel[customer.region.toUpperCase() as Region] || ''
      : '',
  };
}
