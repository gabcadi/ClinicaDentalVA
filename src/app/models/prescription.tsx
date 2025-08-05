import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPrescription extends Document {
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
  createdAt: Date;
}

const prescriptionSchema = new Schema<IPrescription>({
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Prescription: Model<IPrescription> =
  mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', prescriptionSchema);

export default Prescription;
