import type { Response } from "express";
import { ServiceResponse } from "../models/serviceResponse.js";

export const handleServiceResponse = <T>(serviceResponse: ServiceResponse<T>, res: Response): Response => {
  return res.status(serviceResponse.statusCode).json({
    success: serviceResponse.success,
    message: serviceResponse.message,
    data: serviceResponse.data,
  });
};
