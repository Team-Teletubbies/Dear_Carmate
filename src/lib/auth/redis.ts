import Redis from 'ioredis';

// constant 써도 좋겠다~
export const redis = new Redis(process.env.REDIS_URL!);
