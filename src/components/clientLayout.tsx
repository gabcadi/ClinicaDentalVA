"use client";
import { SessionProvider } from "next-auth/react";
import UserButton from "@/components/user-menu";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <UserButton />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </SessionProvider>
  );
}