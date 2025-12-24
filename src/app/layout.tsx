import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata = {
  title: { default: "EZZI World", template: "%s • EZZI World" },
  description:
    "EZZI World — a playable Web3-style game world with capsules, characters, mining, puzzles, and a strict on-chain-inspired marketplace (off-chain).",
  icons: {
    icon: "/brand/icon.svg",
    apple: "/brand/logo.png",
  },
  openGraph: {
    title: "EZZI World",
    description:
      "Explore the universe map, enter regions, open capsules, collect characters, and trade on the marketplace.",
    images: [{ url: "/brand/logo.png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="gridFx" />
        <div className="noise" />
        <AppProviders>
          <SiteHeader />
          {children}
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
