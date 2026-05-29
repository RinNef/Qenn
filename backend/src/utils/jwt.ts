import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
  const jwtExpire = process.env.JWT_EXPIRE || '7d';

  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
    return jwt.verify(token, jwtSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
};