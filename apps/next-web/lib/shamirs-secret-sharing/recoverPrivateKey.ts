import { combine } from "shamirs-secret-sharing-ts";
import { DISTRIBUTED_SERVER_ENDPOINTS, THRESHOLD } from "./config";
import { Keypair } from "@solana/web3.js";
import { decode } from "bs58";
import axios from "axios";

// Function to recover private key using Shamir's Secret Sharing
export function recoverPrivateKey(
  shares: Array<Uint8Array | number[]>
): Keypair {
  if (!shares || shares.length < THRESHOLD) {
    throw new Error("Minimum threshold required");
  }

  const sharesBuffer = shares.map((share) => Buffer.from(share));

  try {
    const recoveredSecret = combine(sharesBuffer);
    const keypair = Keypair.fromSecretKey(decode(recoveredSecret.toString()));
    return keypair;
  } catch (error: any) {
    throw new Error(
      "Could not recover the private key, send a valid uint8 array"
    );
  }
}

// Function to fetch shares from distributed servers
export async function fetchShares(): Promise<number[][]> {
  const sharesArray: number[][] = [];

  const fetchShare = async (endpoint: string): Promise<void> => {
    try {
      const response = await axios.get(`${endpoint}/share`);
      const shareString = response.data.share as string;
      if (shareString) {
        const shareArray = shareString.split(",").map(Number);
        sharesArray.push(shareArray);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  await Promise.all(DISTRIBUTED_SERVER_ENDPOINTS.map(fetchShare));
  return sharesArray;
}
