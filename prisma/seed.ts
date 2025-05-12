import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  // 1. 관리자 비밀번호 해시
  const plainPassword = 'admin1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 2. 회사 생성
  const company = await prisma.company.upsert({
    where: { companyCode: 'COMP001' },
    update: {},
    create: {
      companyName: '텔레토비 컴퍼니',
      companyCode: 'COMP001',
    },
  });

  // 3. 제조사 생성
  const manufacturer = await prisma.manufacturer.upsert({
    where: { name: '현대자동차' },
    update: {},
    create: {
      name: '현대자동차',
    },
  });

  // 4. 차종(CarModel) 생성
  const model = await prisma.carModel.upsert({
    where: {
      name_manufacturerId_type: {
        name: '그랜저',
        manufacturerId: manufacturer.id,
        type: '세단',
      },
    },
    update: {},
    create: {
      name: '그랜저',
      type: '세단',
      manufacturerId: manufacturer.id,
    },
  });

  // 5. 차량(Car) 생성
  const car = await prisma.car.create({
    data: {
      companyId: company.id,
      modelId: model.id,
      carNumber: '12가3456',
      manufacturingYear: 2020,
      mileage: 50000,
      price: 2500,
      accidentCount: 1,
      explanation: '깨끗한 차량입니다.',
      accidentDetails: '조수석 경미한 접촉 사고',
    },
  });

  // 6. 관리자 계정(User) 생성
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      companyId: company.id,
      name: '홍길동',
      email: 'admin@example.com',
      password: hashedPassword,
      employeeNumber: 'EMP001',
      phoneNumber: '010-1234-5678',
      isAdmin: true,
    },
  });

  // 7. 고객(Customer) 생성
  const customer = await prisma.customer.create({
    data: {
      companyId: company.id,
      name: '김철수',
      gender: 'MALE',
      phoneNumber: '010-1111-2222',
      email: 'customer@example.com',
      region: 'SEOUL',
    },
  });

  // 8. 계약(Contract) 생성
  const contract = await prisma.contract.create({
    data: {
      userId: user.id,
      customerId: customer.id,
      carId: car.id,
      companyId: company.id,
      contractPrice: 2300,
      contractStatus: 'CAR_INSPECTION',
    },
  });

  // 9. 미팅(Meeting) 생성
  const meeting = await prisma.meeting.create({
    data: {
      contractId: contract.id,
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3일 후
    },
  });

  // 10. 알람(Alarm) 생성
  await prisma.alarm.create({
    data: {
      meetingId: meeting.id,
      time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2일 후
    },
  });

  // 11. 계약 문서(ContractDocument) 생성
  await prisma.contractDocument.create({
    data: {
      contractId: contract.id,
      fileName: '계약서.pdf',
      filePath: '/docs/contract1.pdf',
      fileSize: 2048,
    },
  });

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
