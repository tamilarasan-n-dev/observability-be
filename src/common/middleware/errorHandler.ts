import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../models/serviceResponse.js";
import { handleServiceResponse } from "../utils/httpHandlers.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error({ err }, "Unhandled error");
  
  handleServiceResponse(
    ServiceResponse.failure(
      err.message || "Internal Server Error",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    ),
    res
  );
};
