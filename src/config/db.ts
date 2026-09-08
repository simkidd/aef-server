import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      dbName: ENV.DB_NAME,
    });
    console.log(
      `[Database] MongoDB Connected [${ENV.NODE_ENV}]: ${conn.connection.host}/${conn.connection.name}`,
    );
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed:`, error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
