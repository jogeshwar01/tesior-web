import { split } from "shamirs-secret-sharing-ts";
import { SHARES, THRESHOLD } from "../config";
import fs from "fs";

// Function to create shares and generate an env file
export function createShares(privateKey: string): void {
  const secretBuffer = Buffer.from(privateKey);
  const shares = split(secretBuffer, { shares: SHARES, threshold: THRESHOLD });

  const data = shares.reduce((accumulatedData, share, index) => {
    const shareNumber = index + 1;
    const shareString = new Uint8Array(share).toString();
    return accumulatedData + `# SHARE_${shareNumber}\nSHARE="${shareString}"\n`;
  }, "");

  fs.writeFileSync("./.env", data);
}

// Example usage
// Put your private key here, run this script, take each share and store in different servers
// createShares("your-private-key-here");
