"use client";
import { SessionProvider } from "next-auth/react";
import UserButton from "@/components/user-menu";
import Footer from "@/components/footer";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster 
        position="bottom-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#1e293b',
          },
        }}
      />
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