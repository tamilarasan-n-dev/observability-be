import cors from "cors";
import express, { type Express } from "express";
import { StatusCodes } from "http-status-codes";
import { errorHandler } from "./common/middleware/errorHandler.js";
import { ServiceResponse } from "./common/models/serviceResponse.js";
import { handleServiceResponse } from "./common/utils/httpHandlers.js";
import { env } from "./common/utils/envConfig.js";
import observerRouter from "./api/observer/observer.router.js";

const app: Express = express();

// Middleware
const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Trust proxy for IP detection
app.set("trust proxy", true);

// Health check
app.get("/health", (_req, res) => {
  handleServiceResponse(ServiceResponse.success("OK", { status: "healthy" }), res);
});

// API Routes
app.use("/api/observer", observerRouter);

// 404 handler
app.use((_req, res) => {
  handleServiceResponse(
    ServiceResponse.failure("Not Found", null, StatusCodes.NOT_FOUND),
    res
  );
});

// Error handler
app.use(errorHandler);

export default app;
