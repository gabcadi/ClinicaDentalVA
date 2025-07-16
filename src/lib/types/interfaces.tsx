import { ObjectId } from 'mongodb';

export interface Patient {
    age: number;
    id: string;
    phone: string;
    address: string;
    userId: ObjectId; 
    createdAt: Date;
    updatedAt: Date;  
}

export interface User {
    _id: ObjectId;
    fullName: string;
    email: string;
    role: 'admin' | 'doctor' | 'user';
    createdAt: Date;
    updatedAt: Date;
} 
