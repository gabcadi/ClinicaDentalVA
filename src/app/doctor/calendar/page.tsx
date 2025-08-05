'use client';

import AppointmentsFullCalendar from '@/components/ui/calendar';

const AppointmentsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <div className="w-full max-w-4xl">
        <AppointmentsFullCalendar />
      </div>
    </div>
  );
};

export default AppointmentsPage;
