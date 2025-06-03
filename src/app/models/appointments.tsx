import mongoose, { Document, Model, Schema } from 'mongoose';

interface IAppointment extends Document {
  description: string;
  date: string;
  time: string;
}

const appointmentSchema = new Schema<IAppointment>({
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;