import mongoose from 'mongoose';
import { initGridFS } from './gridfs';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function connectDB() {
	if (mongoose.connection.readyState >= 1) {
		// Initialize GridFS if connection exists
		initGridFS();
		return;
	}

	try {
		await mongoose.connect(MONGODB_URI, {});
		// Initialize GridFS after connection
		initGridFS();
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw new Error('Failed to connect to MongoDB');
	}
}

export default connectDB;
