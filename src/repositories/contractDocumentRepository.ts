import { prisma } from '../lib/prisma';
import { UploadContractDocument, ContractDocument } from '../types/contractDocumentType';

export const createContractDocument = async (
  data: UploadContractDocument,
): Promise<ContractDocument> => {
  return await prisma.contractDocument.create({ data });
};
