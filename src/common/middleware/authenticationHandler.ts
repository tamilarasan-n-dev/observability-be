import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { env } from "../utils/envConfig.js";
import { ServiceResponse } from "../models/serviceResponse.js";
import { handleServiceResponse } from "../utils/httpHandlers.js";
import { UserModel } from "../../api/user/user.model.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
  };
}

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization?.split(" ");
    
    if (!authorizationHeader || authorizationHeader[0] !== "Bearer" || !authorizationHeader[1]) {
      handleServiceResponse(
        ServiceResponse.failure("Unauthorized - Missing or invalid token", null, StatusCodes.UNAUTHORIZED),
        res
      );
      return;
    }

    const token = authorizationHeader[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;

      const user = await UserModel.findById(decoded.sub).exec();
      if (!user) {
        handleServiceResponse(
          ServiceResponse.failure("Unauthorized - User not found", null, StatusCodes.UNAUTHORIZED),
          res
        );
        return;
      }

      (req as AuthenticatedRequest).user = {
        _id: user._id.toString(),
        email: user.email,
      };

      next();
    } catch {
      handleServiceResponse(
        ServiceResponse.failure("Unauthorized - Invalid or expired token", null, StatusCodes.UNAUTHORIZED),
        res
      );
    }
  } catch {
    handleServiceResponse(
      ServiceResponse.failure("Unauthorized - Authentication failed", null, StatusCodes.UNAUTHORIZED),
      res
    );
  }
};
