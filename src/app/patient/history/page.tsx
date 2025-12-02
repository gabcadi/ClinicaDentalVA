import { redirect } from 'next/navigation';

export default function PatientHistoryRedirectPage() {
  // Redirige a Mis Citas para evitar 404
  redirect('/patient/appointments');
}
