import { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";

// To fix hydration errors - Dynamically import the WalletMultiButton for client-side rendering
const WalletMultiButtonDynamic = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

interface UsePublicKeyHook {
  WalletMultiButtonDynamic: any;
  signAndSend: () => Promise<void>;
}

export function usePublicKey(): UsePublicKeyHook {
  const { publicKey, signMessage } = useWallet();

  const signAndSend = useCallback(async () => {
    if (!publicKey) {
      console.log("No public key available.");
      return;
    }

    const response = await fetch(
      `/api/wallet?publicKey=${publicKey.toString()}`
    );
    if (response.status === 404) {
      const message = new TextEncoder().encode("Verify public key for tesior");
      const signature = await signMessage?.(message);

      await fetch(`/api/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature,
          publicKey: publicKey.toString(),
        }),
      });
    } else {
      console.log("Public key already saved in the database");
    }
  }, [publicKey, signMessage]);

  useEffect(() => {
    signAndSend();
  }, [publicKey, signAndSend]);

  return { WalletMultiButtonDynamic, signAndSend };
}
