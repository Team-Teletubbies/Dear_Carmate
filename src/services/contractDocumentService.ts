import { createContractDocument } from '../repositories/contractDocumentRepository';
import { UploadContractDocumentResponseDTO } from '../dto/contractDocumentDTO';
import { UploadContractDocument } from '../types/contractDocumentType';

export const uploadContractDocument = async (
  data: UploadContractDocument,
): Promise<UploadContractDocumentResponseDTO> => {
  const created = await createContractDocument(data);
  return new UploadContractDocumentResponseDTO(created);
};
