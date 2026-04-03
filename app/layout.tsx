import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DDay Counter",
  description: "Track your important dates and countdowns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
