import type { Request, Response } from "express";
import { handleServiceResponse } from "../../common/utils/httpHandlers.js";
import { observerService } from "./observer.service.js";
import type { CreateObserverInput, ListObserverInput } from "./observer.schema.js";

export const observerController = {
  async create(req: Request, res: Response): Promise<void> {
    const payload = req.body as CreateObserverInput;
    const ip = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
    payload.metaData = {
      path: req.path,
      method: req.method,
      headers: {
        "user-agent": req.headers["user-agent"],
        "content-type": req.headers["content-type"],
      },
      query: req.query,
      body: JSON.parse(JSON.stringify(req.body)),
      params: req.params,
    };
    const response = await observerService.create(payload, ip);
    handleServiceResponse(response, res);
  },

  async list(req: Request, res: Response): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = req.body as ListObserverInput;

    const response = await observerService.list({
      ...filters,
      page,
      limit,
    });
    handleServiceResponse(response, res);
  },
};
