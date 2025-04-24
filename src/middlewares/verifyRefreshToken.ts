import { expressjwt } from 'express-jwt';
import { Secret } from 'jsonwebtoken';

export const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET as Secret,
  algorithms: ['HS256'],
  requestProperty: 'user',
  getToken: (req) => req.body.refreshToken,
});
