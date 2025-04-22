import { prisma } from '../src/lib/prisma';

async function main() {
  // 1. Manufacturer + CarModel
  const [kia, hyundai, tesla] = await Promise.all([
    prisma.manufacturer.create({
      data: {
        name: 'KIA',
        models: {
          create: [
            { name: 'K5', type: 'SEDAN' },
            { name: 'K3', type: 'SEDAN' },
            { name: 'Sportage', type: 'SUV' },
          ],
        },
      },
    }),
    prisma.manufacturer.create({
      data: {
        name: 'Hyundai',
        models: {
          create: [
            { name: 'Sonata', type: 'SEDAN' },
            { name: 'Avante', type: 'SEDAN' },
            { name: 'Tucson', type: 'SUV' },
          ],
        },
      },
    }),
    prisma.manufacturer.create({
      data: {
        name: 'Tesla',
        models: {
          create: [
            { name: 'Model S', type: 'SEDAN' },
            { name: 'Model 3', type: 'SEDAN' },
            { name: 'Model X', type: 'SUV' },
          ],
        },
      },
    }),
  ]);

  // 2. Company
  const companies = await prisma.company.createMany({
    data: [
      { companyName: '주식회사 카플랜', companyCode: 'CPLAN123' },
      { companyName: '오토랜드', companyCode: 'AUTO456' },
      { companyName: '드림모터스', companyCode: 'DREAM789' },
    ],
  });

  const allCompanies = await prisma.company.findMany();

  // 3. User
  const users = await prisma.user.createMany({
    data: [
      {
        name: '김철수',
        email: 'kim@test.com',
        password: 'pass1234',
        employeeNumber: 'EMP001',
        phoneNumber: '010-1111-2222',
        companyId: allCompanies[0].id,
      },
      {
        name: '이영희',
        email: 'lee@test.com',
        password: 'pass5678',
        employeeNumber: 'EMP002',
        phoneNumber: '010-2222-3333',
        companyId: allCompanies[1].id,
      },
      {
        name: '박민준',
        email: 'park@test.com',
        password: 'pass9012',
        employeeNumber: 'EMP003',
        phoneNumber: '010-3333-4444',
        companyId: allCompanies[2].id,
      },
    ],
  });

  const allUsers = await prisma.user.findMany();

  // 4. Customer
  await prisma.customer.createMany({
    data: [
      {
        name: '고객1',
        gender: 'MALE',
        phoneNumber: '010-5555-1111',
        email: 'cust1@example.com',
        companyId: allCompanies[0].id,
      },
      {
        name: '고객2',
        gender: 'FEMALE',
        phoneNumber: '010-5555-2222',
        email: 'cust2@example.com',
        companyId: allCompanies[1].id,
      },
      {
        name: '고객3',
        gender: 'MALE',
        phoneNumber: '010-5555-3333',
        email: 'cust3@example.com',
        companyId: allCompanies[2].id,
      },
    ],
  });

  const allModels = await prisma.carModel.findMany();

  // 5. Car
  await prisma.car.createMany({
    data: [
      {
        carNumber: '12가1234',
        companyId: allCompanies[0].id,
        manufacturerId: kia.id,
        modelId: allModels.find((m) => m.name === 'K5')!.id,
        manufacturingYear: 2021,
        mileage: 15000,
        price: 2000,
        accidentCount: 1,
        explanation: '무사고에 가까움',
        accidentDetails: '조수석 범퍼 교체',
      },
      {
        carNumber: '34나5678',
        companyId: allCompanies[1].id,
        manufacturerId: hyundai.id,
        modelId: allModels.find((m) => m.name === 'Sonata')!.id,
        manufacturingYear: 2019,
        mileage: 30000,
        price: 1500,
        accidentCount: 2,
        explanation: '경미한 사고 있음',
        accidentDetails: '뒤 범퍼, 도장',
      },
      {
        carNumber: '56다9012',
        companyId: allCompanies[2].id,
        manufacturerId: tesla.id,
        modelId: allModels.find((m) => m.name === 'Model 3')!.id,
        manufacturingYear: 2023,
        mileage: 5000,
        price: 5000,
        accidentCount: 0,
        explanation: '완전 무사고',
        accidentDetails: '',
      },
    ],
  });

  const allCustomers = await prisma.customer.findMany();
  const allCars = await prisma.car.findMany();

  // 6. Contract
  const contract1 = await prisma.contract.create({
    data: {
      userId: allUsers[0].id,
      carId: allCars[0].id,
      customerId: allCustomers[0].id,
      companyId: allCompanies[0].id,
      contractPrice: 2200,
      resolutionDate: new Date(),
    },
  });
  const contract2 = await prisma.contract.create({
    data: {
      userId: allUsers[1].id,
      carId: allCars[1].id,
      customerId: allCustomers[1].id,
      companyId: allCompanies[1].id,
      contractPrice: 1800,
      resolutionDate: new Date(),
    },
  });
  const contract3 = await prisma.contract.create({
    data: {
      userId: allUsers[2].id,
      carId: allCars[2].id,
      customerId: allCustomers[2].id,
      companyId: allCompanies[2].id,
      contractPrice: 5200,
      resolutionDate: new Date(),
    },
  });

  // 7. Meeting
  const meetings = await prisma.meeting.createMany({
    data: [
      { contractId: contract1.id, date: new Date() },
      { contractId: contract2.id, date: new Date() },
      { contractId: contract3.id, date: new Date() },
    ],
  });

  const allMeetings = await prisma.meeting.findMany();

  // 8. Alarm
  await prisma.alarm.createMany({
    data: [
      { meetingId: allMeetings[0].id, time: new Date() },
      { meetingId: allMeetings[1].id, time: new Date() },
      { meetingId: allMeetings[2].id, time: new Date() },
    ],
  });

  // 9. ContractDocument
  await prisma.contractDocument.createMany({
    data: [
      {
        contractId: contract1.id,
        companyId: allCompanies[0].id,
        fileName: '계약서1.pdf',
        filePath: '/docs/contract1.pdf',
        fileSize: 2048,
      },
      {
        contractId: contract2.id,
        companyId: allCompanies[1].id,
        fileName: '계약서2.pdf',
        filePath: '/docs/contract2.pdf',
        fileSize: 3072,
      },
      {
        contractId: contract3.id,
        companyId: allCompanies[2].id,
        fileName: '계약서3.pdf',
        filePath: '/docs/contract3.pdf',
        fileSize: 1024,
      },
    ],
  });

  console.log('✅ Seed 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
