import { Customer } from '@prisma/client';

export function toLowerCaseCustomer(customer: Customer | any) {
  return {
    ...customer,
    gender: customer.gender?.toLowerCase() || '',
    ageGroup: customer.ageGroup?.toLowerCase() ?? null,
    region: customer.region?.toLowerCase() ?? null,
  };
}
