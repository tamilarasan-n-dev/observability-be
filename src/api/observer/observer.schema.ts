import { z } from "zod";

export const createObserverSchema = z.object({
  pageRoute: z.string().min(1, "pageRoute is required"),
  metaData: z.record(z.unknown()).optional(),
});

export const listObserverSchema = z.object({
  groupBy: z.enum(["ip", "path"]).optional(),
  ip: z.string().optional(),
  pageRoute: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateObserverInput = z.infer<typeof createObserverSchema>;
export type ListObserverInput = z.infer<typeof listObserverSchema>;
