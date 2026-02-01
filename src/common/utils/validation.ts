import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodSchema } from "zod";
import { ServiceResponse } from "../models/serviceResponse.js";
import { handleServiceResponse } from "./httpHandlers.js";

export const validateRequest =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      handleServiceResponse(
        ServiceResponse.failure("Validation failed", errors, StatusCodes.BAD_REQUEST),
        res
      );
      return;
    }

    req[source] = result.data;
    next();
  };
