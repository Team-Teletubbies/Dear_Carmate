import { prisma } from '../lib/prisma';
import { UploadContractDocument, ContractDocument } from '../types/contractDocumentType';

export const createContractDocument = async (
  data: UploadContractDocument,
): Promise<ContractDocument> => {
  return await prisma.contractDocument.create({ data });
};

export const findContractDocumentById = async (id: number): Promise<ContractDocument | null> => {
  return await prisma.contractDocument.findUnique({ where: { id } });
};

export const findContractDocumentIdByFileName = async (
  fileName: string,
): Promise<number | undefined> => {
  const found = await prisma.contractDocument.findFirst({
    where: { fileName: { equals: fileName.trim() }, contractId: null },
    orderBy: {
      createdAt: 'desc',
    },
    select: { id: true },
  });

  return found?.id;
};

export const updateMultipleContractDocumentIds = async (
  documnetIds: number[],
  contractId: number,
) => {
  const result = await prisma.contractDocument.updateMany({
    where: {
      id: {
        in: documnetIds,
      },
    },
    data: {
      contractId: contractId,
    },
  });
};
