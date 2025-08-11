import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./reset.css";
import ClientLayout from "@/components/clientLayout"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clínica Dental Vargas Araya",
  description: "Tecnología de vanguardia, atención personalizada y resultados extraordinarios en el corazón de Costa Rica.",
  keywords: ["clínica dental", "dentista", "ortodoncia", "blanqueamiento", "implantes", "Costa Rica"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full m-0 p-0`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}