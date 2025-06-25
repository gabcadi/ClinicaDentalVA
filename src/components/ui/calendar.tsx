'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { useEffect, useState } from 'react';

interface Appointment {
  _id: string;
  description: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:mm
}

export default function AppointmentsFullCalendar() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then((data: Appointment[]) => {
        const mapped = data.map(appt => ({
          id: appt._id,
          title: appt.description,
          start: `${appt.date}T${appt.time}`,
        }));
        setEvents(mapped);
      });
  }, []);

  return (
		<FullCalendar
			plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
			initialView="dayGridMonth"
			headerToolbar={{
				left: 'prev,next today',
				center: 'title',
				right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
			}}
			buttonText={{
				today: 'Hoy',
				month: 'Mes',
				week: 'Semana',
				day: 'Día',
				list: 'Agenda',
			}}
			locale="es"
			events={events}
			height={700}
			slotLabelFormat={{
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			}}
		/>
  );
}