import { createContract } from '../repositories/contractRepository';
import { CreateContractResponseDTO, CreateContractDTO } from '../dto/contractDTO';

export const createContractData = async (
  data: CreateContractDTO,
): Promise<CreateContractResponseDTO> => {
  const contract = await createContract(data);

  return new CreateContractResponseDTO(contract);
};
