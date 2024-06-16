import { TOTAL_DECIMALS } from "./constants";

export const lamportsToSol = (
  lamports: bigint | undefined
): number | undefined => {
  if (!lamports) return 0;

  const dividedAmount = Number(lamports) / Number(TOTAL_DECIMALS);
  const formattedAmount = parseFloat(dividedAmount.toFixed(3)); // keep upto 3 decimals and remove trailing zeroes
  return formattedAmount;
};

export const solToLamports = (sol: number): bigint => {
  return BigInt(sol * TOTAL_DECIMALS);
};
