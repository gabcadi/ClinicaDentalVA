import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/mongodb';
import PatientModel from '@/app/models/patients';
import { getGridFSBucket } from '@/app/utils/gridfs';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG and WebP are allowed' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get GridFS bucket
    const bucket = getGridFSBucket();

    // Create unique filename
    const timestamp = Date.now();
    const filename = `patient_${id}_${timestamp}_${file.name}`;
    
    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
      metadata: {
        patientId: id,
        type: type || 'photo',
        description: description || '',
        originalName: file.name,
        uploadedAt: new Date()
      }
    });

    // Upload file as promise
    const gridfsId = await new Promise<mongoose.Types.ObjectId>((resolve, reject) => {
      uploadStream.on('finish', () => {
        resolve(uploadStream.id as mongoose.Types.ObjectId);
      });

      uploadStream.on('error', (error) => {
        reject(error);
      });

      uploadStream.write(buffer);
      uploadStream.end();
    });

    // Update patient record
    const imageData = {
      gridfsId,
      filename,
      originalName: file.name,
      contentType: file.type,
      size: file.size,
      type: type || 'photo',
      description: description || '',
      uploadedAt: new Date()
    };

    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      { 
        $push: { medicalImages: imageData },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedPatient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      image: imageData,
      patient: updatedPatient
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const patient = await PatientModel.findById(id).select('medicalImages');
    
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      images: patient.medicalImages || []
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    // Find patient and the specific image
    const patient = await PatientModel.findById(id);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Find the image to get GridFS ID
    const image = patient.medicalImages?.find((img: any) => img._id.toString() === imageId);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from GridFS
    const bucket = getGridFSBucket();
    try {
      await bucket.delete(image.gridfsId);
    } catch (gridfsError) {
      console.error('Error deleting from GridFS:', gridfsError);
      // Continue with database update even if GridFS deletion fails
    }

    // Remove from patient record
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      id,
      { 
        $pull: { medicalImages: { _id: imageId } },
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ 
      message: 'Image deleted successfully',
      patient: updatedPatient
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
