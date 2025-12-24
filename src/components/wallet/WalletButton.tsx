"use client";

import dynamic from "next/dynamic";

// WalletMultiButton uses window APIs; dynamic import avoids any SSR issues.
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  return (
    <div className="walletBtn">
      <WalletMultiButton />
    </div>
  );
}
