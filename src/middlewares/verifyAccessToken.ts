import { expressjwt } from 'express-jwt';
import { Secret } from 'jsonwebtoken';

export const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET as Secret,
  algorithms: ['HS256'],
  requestProperty: 'user',
  getToken: (req) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    return token;
  },
});
