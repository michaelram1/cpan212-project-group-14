import mongoose from 'mongoose';
export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Configure api/.env.');
  mongoose.set('sanitizeFilter', true);
  await mongoose.connect(process.env.MONGODB_URI);
}
