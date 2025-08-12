import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/utils/mongodb';
import { getGridFSBucket } from '@/app/utils/gridfs';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    await connectDB();
    const { imageId } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(imageId);

    // Verificar si el archivo existe
    const files = await bucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const file = files[0];

    // Crear stream para leer el archivo
    const downloadStream = bucket.openDownloadStream(objectId);

    // Convertir stream a buffer
    const chunks: Buffer[] = [];
    
    return new Promise((resolve, reject) => {
      downloadStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        const response = new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': file.contentType || 'image/jpeg',
            'Content-Length': file.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });

        resolve(response);
      });

      downloadStream.on('error', (error: any) => {
        console.error('Error streaming file:', error);
        reject(NextResponse.json({ error: 'Error retrieving image' }, { status: 500 }));
      });
    });

  } catch (error) {
    console.error('Error in image API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
