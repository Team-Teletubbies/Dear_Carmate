export interface Company {
  id: number;
  companyName: string;
  companyCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyWithCount = Omit<Company, 'createdAt' | 'updatedAt'> & {
  _count: {
    users: number;
  };
};
