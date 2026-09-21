import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QQ Companion",
  description: "A social shell for persistent AI characters."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
