import { randomBytes } from "node:crypto"; // node: prefix = modern best practice

export const generateCode = () => {
  const rand = randomBytes(4).toString("hex").toUpperCase(); // e.g. "A3F90C2B"
  return `EVT-${rand}`;
};
