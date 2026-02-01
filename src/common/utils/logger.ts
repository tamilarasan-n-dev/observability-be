import { pino } from "pino";
import { env } from "./envConfig.js";

export const logger = pino({
  name: "observability-api",
  level: env.isProduction ? "info" : "debug",
});

