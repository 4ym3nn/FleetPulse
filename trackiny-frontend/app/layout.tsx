import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
;
import { montserrat } from "./fonts";

export const metadata :Metadata= {
  title: "Trackiny",
  description: "Trackiny App",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
            <Providers>
      <body
        className={`font-sans bg-soft-gradient  ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
            </Providers>
    </html>
  );
}
