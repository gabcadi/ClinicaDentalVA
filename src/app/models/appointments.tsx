import mongoose, { Document, Model, Schema } from 'mongoose';

interface IMaterial {
  _id?: string;
  name: string;
  type: string;
  quantity: number;
  createdAt: Date;
}

interface IAppointment extends Document {
  description: string;
  date: string;
  time: string;
  confirmed?: boolean;
  patientId?: mongoose.Types.ObjectId;
  materials?: IMaterial[];
  doctorReport?: string;
  totalPrice?: number;
  prescriptionId?: string[] | null;
}

const materialSchema = new Schema<IMaterial>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now }
});

const appointmentSchema = new Schema<IAppointment>({
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  confirmed: { type: Boolean, default: false },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  materials: { type: [materialSchema], default: [] },
  doctorReport: { type: String, default: '' },
  totalPrice: { type: Number, default: 0 },
  prescriptionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
});

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
export type { IMaterial, IAppointment };
