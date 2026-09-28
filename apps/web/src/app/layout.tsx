import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Make My Event", description: "Plan beautifully. Celebrate effortlessly." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
