import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose';

interface Patient extends Document {
	_id: ObjectId; 
	age: number;
	id: string;
	phone: string;
	address: string;
	userId: mongoose.Types.ObjectId; 
	createdAt: Date;
	updatedAt: Date;
}

const patientSchema = new Schema<Patient>({
	_ide: { type: mongoose.Schema.Types.ObjectId, auto: true },
	age: { type: Number, required: true },
	id: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	address: { type: String, required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        // required: true 
    }, 
	createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const PatientModel: Model<Patient> = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default PatientModel;
