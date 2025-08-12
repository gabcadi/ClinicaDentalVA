import mongoose, { Document, Model, Schema } from 'mongoose';

interface MedicalImage {
  _id?: string;
  gridfsId: mongoose.Types.ObjectId; // ID del archivo en GridFS
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  type: string; 
  description?: string;
  uploadedAt: Date;
}

interface Patient extends Document {
	age: number;
	id: string;
	phone: string;
	address: string;
	userId: mongoose.Types.ObjectId; 
	medicalImages?: MedicalImage[];
	createdAt: Date;
	updatedAt: Date;
}

const medicalImageSchema = new Schema<MedicalImage>({
  gridfsId: { type: Schema.Types.ObjectId, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  description: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

const patientSchema = new Schema<Patient>({
	age: { type: Number, required: true },
	id: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	address: { type: String, required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        // required: true 
    },
	medicalImages: [medicalImageSchema],
	createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const PatientModel: Model<Patient> = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default PatientModel;
export type { Patient, MedicalImage };
