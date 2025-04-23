import { UserWithPasswordAndCompany } from '../../types/userType';
// import { JWT_SECRET } from '../constants';
// Todo: constants 따로 지정할지
import jwt from 'jsonwebtoken';

export const createToken = (user: UserWithPasswordAndCompany, type?: string): string => {
  const payload = { userId: user.id, companyId: user.company.id };
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '1h',
    algorithm: 'HS256' as const,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, options as jwt.SignOptions);
};
