import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Make My Event | Plan beautifully, celebrate effortlessly",
  description:
    "Bring every guest, function, and detail of your celebration together in one thoughtful place.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
