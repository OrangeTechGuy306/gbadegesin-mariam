import mongoose from 'mongoose';
import { seedDatabase } from './seed';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.warn('MONGODB_URI environment variable is not defined inside env configs. Database connectivity is disabled; running in local/fallback mode.');
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Reset cached connection and promise if the connection is not active (0: disconnected, 3: disconnecting)
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    console.log('Initiating database connection to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('Database connected successfully.');
      // Seed initial data asynchronously without blocking the connection resolution
      seedDatabase().catch((err) => {
        console.error('Database seeding failed:', err);
      });
      return mongooseInstance;
    }).catch((err) => {
      console.error('Mongoose connection promise rejected:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error('Failed to establish database connection:', e.message);
    return null;
  }

  return cached.conn;
}

export default connectDB;
