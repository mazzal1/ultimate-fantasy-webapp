import mongoose from 'mongoose';

let connectionPromise;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const uri = process.env.DOCUMENTDB_URI;
    if (!uri) {
      throw new Error('DOCUMENTDB_URI is not configured.');
    }

    connectionPromise = mongoose.connect(uri, {
      dbName: 'ultimatefantasy',
      tlsAllowInvalidHostnames: true,
      retryWrites: false,
    });
  }

  await connectionPromise;
  return mongoose.connection;
}
