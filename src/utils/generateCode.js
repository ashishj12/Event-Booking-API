import { randomBytes } from 'node:crypto';

export const generateCode = () => {
  const rand = randomBytes(4).toString('hex').toUpperCase();
  return `EVT-${rand}`;
};
