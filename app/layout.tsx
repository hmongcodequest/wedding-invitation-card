import type { Metadata } from "next";
import { Noto_Sans_Lao_Looped, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const notoLao = Noto_Sans_Lao_Looped({
  subsets: ["lao"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-lao",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ບັດເຊີນງານແຕ່ງງານ",
  description:
    "Lao wedding invitation card generator with guest management and print-ready A4 / A7 (5x7 in) cards",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="lo"
      className={`${playfair.variable} ${notoLao.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}