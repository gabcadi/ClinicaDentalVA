'use client';

import AppointmentsFullCalendar from '@/components/ui/calendar';
import { DoctorGuard } from '@/components/DoctorGuard';

const AppointmentsPage = () => {
  return (
    <DoctorGuard>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8">
        <div className="w-full max-w-4xl">
          <AppointmentsFullCalendar />
        </div>
      </div>
    </DoctorGuard>
  );
};

export default AppointmentsPage;
