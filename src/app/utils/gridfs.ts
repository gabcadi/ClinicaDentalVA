import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let bucket: GridFSBucket;

export const initGridFS = () => {
  if (!bucket && mongoose.connection.db) {
    bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'medical_images'
    });
  }
  return bucket;
};

export const getGridFSBucket = () => {
  if (!bucket) {
    bucket = initGridFS();
  }
  return bucket;
};
