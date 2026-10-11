import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloco 31 — BH",
  description: "Moda, imagem, encontros e cultura. Conheça o Bloco 31 e acompanhe as próximas datas.",
  icons: {
    icon: "/brand/pendant.png",
    shortcut: "/brand/pendant.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
