"use client";
import { SessionProvider } from 'next-auth/react';
import UserButton from '@/components/user-button';
import Appointment from '../app/appointments/page';   

export default function Home() {
  return (
    <div>
      <SessionProvider>
        <UserButton />
        <Appointment />
      </SessionProvider>
    </div>
  );
}
