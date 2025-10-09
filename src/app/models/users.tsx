import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'doctor';
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'doctor'], default: 'user' },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
// This code defines a Mongoose model for a User in a MongoDB database.