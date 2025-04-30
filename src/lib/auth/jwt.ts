import { TokenPayload, UserWithPasswordAndCompany } from '../../types/userType';
// import { JWT_SECRET } from '../constants';
// Todo: constants 따로 지정할지
import jwt from 'jsonwebtoken';

export const createToken = (data: TokenPayload, type?: 'access' | 'refresh'): string => {
  const options = {
    expiresIn: type === 'refresh' ? '2w' : '10h',
    algorithm: 'HS256' as const,
  };

  return jwt.sign(data, process.env.JWT_SECRET as jwt.Secret, options as jwt.SignOptions);
};
