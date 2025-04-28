import { prisma } from '../lib/prisma';

export const getDashboardStats = async (companyId: number) => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    monthlySales,
    lastMonthSales,
    proceedingContractsCount,
    completedContractsCount,
    contracts,
    sales,
  ] = await Promise.all([
    prisma.contract.aggregate({
      _sum: { contractPrice: true },
      where: {
        companyId,
        resolutionDate: { gte: thisMonthStart },
      },
    }),
    prisma.contract.aggregate({
      _sum: { contractPrice: true },
      where: {
        companyId,
        resolutionDate: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
    prisma.contract.count({
      where: {
        companyId,
        contractStatus: { not: 'CONTRACT_SUCCESSFUL' },
      },
    }),
    prisma.contract.count({
      where: {
        companyId,
        contractStatus: 'CONTRACT_SUCCESSFUL',
      },
    }),
    prisma.contract.groupBy({
      by: ['carId'],
      where: {
        companyId,
      },
      _count: true,
    }),
    prisma.contract.groupBy({
      by: ['carId'],
      where: {
        companyId,
      },
      _sum: {
        contractPrice: true,
      },
    }),
  ]);

  const carMap = await prisma.car.findMany({
    where: { companyId },
    include: { model: true },
  });

  const carIdToTypeMap: Record<number, string> = {};
  carMap.forEach((car) => {
    carIdToTypeMap[car.id] = car.model.type;
  });

  const contractsByCarType: Record<string, number> = {};
  contracts.forEach((group) => {
    const carType = carIdToTypeMap[group.carId] || '기타';
    contractsByCarType[carType] = (contractsByCarType[carType] || 0) + group._count;
  });

  const salesByCarType: Record<string, number> = {};
  sales.forEach((group) => {
    const carType = carIdToTypeMap[group.carId] || '기타';
    salesByCarType[carType] = (salesByCarType[carType] || 0) + (group._sum.contractPrice || 0);
  });

  const formatGroup = (data: Record<string, number>) =>
    Object.entries(data).map(([carType, count]) => ({ carType, count }));

  const growthRate = lastMonthSales._sum.contractPrice
    ? Math.round(
        (((monthlySales._sum.contractPrice || 0) - lastMonthSales._sum.contractPrice) /
          lastMonthSales._sum.contractPrice) *
          100,
      )
    : 0;

  return {
    monthlySales: monthlySales._sum.contractPrice || 0,
    lastMonthSales: lastMonthSales._sum.contractPrice || 0,
    growthRate,
    proceedingContractsCount,
    completedContractsCount,
    contractsByCarType: formatGroup(contractsByCarType),
    salesByCarType: formatGroup(salesByCarType),
  };
};
