"use client";
import { SessionProvider } from "next-auth/react";
import UserButton from "@/components/user-menu";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster />
      <UserButton />
      {children}
    </SessionProvider>
  );
}