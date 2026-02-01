import mongoose from "mongoose";
import { pino } from "pino";
import { env } from "../common/utils/envConfig.js";

const logger = pino({ name: "mongodb" });

const mongoOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4,
};

export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, mongoOptions);
    logger.info("MongoDB: Connected successfully");
  } catch (error) {
    logger.error({ err: error }, "MongoDB: Connection failed");
    throw error;
  }
};

mongoose.connection.on("connected", () => {
  logger.info("MongoDB: Connection established");
});

mongoose.connection.on("error", (error) => {
  logger.error({ err: error }, "MongoDB: Connection error");
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB: Disconnected");
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing MongoDB connection");
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, closing MongoDB connection");
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
  process.exit(0);
});

export default mongoose;
