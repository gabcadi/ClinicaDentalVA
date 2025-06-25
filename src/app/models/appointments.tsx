import mongoose, { Document, Model, Schema } from 'mongoose';

interface IAppointment extends Document {
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
}

const appointmentSchema = new Schema<IAppointment>({
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  confirmed: { type: Boolean, default: false }
});

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;