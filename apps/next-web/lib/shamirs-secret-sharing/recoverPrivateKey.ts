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
  // currently using these directly from env variables - on devnet so no issues
  // will ideally come from distributed servers implemented in https://github.com/jogeshwar01/tesior-pkm
  // BUDGET ISSUE :(
  const share1 = process.env.SHARE_1;
  const share2 = process.env.SHARE_2;
  const share3 = process.env.SHARE_3;
  const share4 = process.env.SHARE_4;
  const share5 = process.env.SHARE_5;

  if (share1 && share2 && share3 && share4 && share5) {
    sharesArray.push(
      share1.split(",").map(Number),
      share2.split(",").map(Number),
      share3.split(",").map(Number),
      share4.split(",").map(Number),
      share5.split(",").map(Number)
    );
  }

  return sharesArray;

  // const fetchShare = async (endpoint: string): Promise<void> => {
  //   try {
  //     const response = await axios.get(`${endpoint}/share`);
  //     const shareString = response.data.share as string;
  //     if (shareString) {
  //       const shareArray = shareString.split(",").map(Number);
  //       sharesArray.push(shareArray);
  //     }
  //   } catch (error: any) {
  //     console.log(error.message);
  //   }
  // };

  // await Promise.all(DISTRIBUTED_SERVER_ENDPOINTS.map(fetchShare));
  // return sharesArray;
}
