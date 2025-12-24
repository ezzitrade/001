import { CalculatorClient } from "@/components/tools/CalculatorClient";

export const metadata = {
  title: "Revenue Calculator",
  description: "Estimate revenue scenarios for tokens, Capsules, and Characters.",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
