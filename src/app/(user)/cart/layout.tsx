import { CartTotalProvider } from "@/hooks/CartTotalContext";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartTotalProvider>{children}</CartTotalProvider>;
}
