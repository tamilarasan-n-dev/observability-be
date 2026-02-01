import { Router } from "express";
import { authenticateRequest } from "../../common/middleware/authenticationHandler.js";
import { validateRequest } from "../../common/utils/validation.js";
import { observerController } from "./observer.controller.js";
import { createObserverSchema, listObserverSchema } from "./observer.schema.js";

const router = Router();

// POST /api/observer - Create observer (public)
router.post(
  "/",
  validateRequest(createObserverSchema),
  observerController.create
);

// POST /api/observer/list - List observers with filters (authenticated)
router.post(
  "/list",
  validateRequest(listObserverSchema),
  authenticateRequest,
  observerController.list
);

export default router;
