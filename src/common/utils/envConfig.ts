import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "6767", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/observability",
  JWT_SECRET: process.env.JWT_SECRET || "default-secret-key",
  HOST: process.env.HOST || "http://localhost",
  isProduction: process.env.NODE_ENV === "production",
};
