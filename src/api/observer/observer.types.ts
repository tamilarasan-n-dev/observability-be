import type { Document, Types } from "mongoose";

export interface IObserver extends Document {
  _id: Types.ObjectId;
  ip: string;
  pageRoute: string;
  metaData?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IObserverCreatePayload {
  pageRoute: string;
  metaData?: Record<string, unknown>;
}

export interface IObserverListFilters {
  page?: number;
  limit?: number;
  groupBy?: "ip" | "path";
  ip?: string;
  pageRoute?: string;
  startDate?: string;
  endDate?: string;
}

export interface IPaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
