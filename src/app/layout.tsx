import { Provider } from "@/components/ui/provider"
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";


const montserratSans = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Administração - D. Oliveira Nascimento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${montserratSans.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
