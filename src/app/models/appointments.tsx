import mongoose, { Document, Model, Schema } from 'mongoose';

interface IAppointment extends Document {
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
  patientId?: mongoose.Types.ObjectId;
  materials?: string[];
  doctorReport?: string;
  totalPrice?: number;
  prescriptionId?: string[] | null;
}

const appointmentSchema = new Schema<IAppointment>({
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  materials: { type: [String], default: [] },
  doctorReport: { type: String, default: '' },
  totalPrice: { type: Number, default: 0 },
prescriptionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
});

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
