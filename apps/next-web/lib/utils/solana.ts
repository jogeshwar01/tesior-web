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
  const lamports = (sol * TOTAL_DECIMALS).toFixed(0);
  return BigInt(lamports);
};

export const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/simple/price";

export const convertDollarToSolana = async (
  amount: number
): Promise<number> => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}?ids=solana&vs_currencies=usd`
    );
    const data = await response.json();
    const solanaPriceInUSD = data.solana.usd;

    if (!solanaPriceInUSD) {
      throw new Error("Unable to fetch Solana price.");
    }

    return amount / solanaPriceInUSD;
  } catch (error) {
    console.error("Error converting USD to Solana:", error);
    throw error;
  }
};
