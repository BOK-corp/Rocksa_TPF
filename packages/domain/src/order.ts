const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const randomToken = (len: number, rand: () => number = Math.random): string =>
  Array.from({ length: len }, () => ALPHABET[Math.floor(rand() * ALPHABET.length)]!).join("");

export const orderReference = (
  now: Date = new Date(),
  rand: () => number = Math.random,
): string => {
  const yy = String(now.getFullYear()).slice(-2);
  return `RK-${randomToken(4, rand)}-${yy}`;
};
