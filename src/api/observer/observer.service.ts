import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../../common/models/serviceResponse.js";
import { ObserverModel } from "./observer.model.js";
import type {
  IObserver,
  IObserverCreatePayload,
  IObserverListFilters,
  IPaginatedResponse,
} from "./observer.types.js";

export const observerService = {
  async create(
    payload: IObserverCreatePayload,
    ip: string
  ): Promise<ServiceResponse<IObserver>> {
    const observer = await ObserverModel.create({
      ...payload,
      ip,
    });
    return ServiceResponse.success("Observer created", observer, StatusCodes.CREATED);
  },

  async list(
    filters: IObserverListFilters
  ): Promise<ServiceResponse<IPaginatedResponse<IObserver> | unknown[]>> {
    const { page = 1, limit = 10, groupBy, ip, pageRoute, startDate, endDate } = filters;

    // Build match query
    const matchQuery: Record<string, unknown> = {};
    if (ip) matchQuery.ip = ip;
    if (pageRoute) matchQuery.pageRoute = { $regex: pageRoute, $options: "i" };
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) (matchQuery.createdAt as Record<string, Date>)["$gte"] = new Date(startDate);
      if (endDate) (matchQuery.createdAt as Record<string, Date>)["$lte"] = new Date(endDate);
    }

    // Handle groupBy aggregation
    if (groupBy) {
      const groupField = groupBy === "ip" ? "$ip" : "$pageRoute";
      const result = await ObserverModel.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: groupField,
            count: { $sum: 1 },
            lastSeen: { $max: "$createdAt" },
          },
        },
        { $sort: { count: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]);
      return ServiceResponse.success("Observers grouped", result);
    }

    // Regular paginated list
    const skip = (page - 1) * limit;
    const [docs, totalDocs] = await Promise.all([
      ObserverModel.find(matchQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      ObserverModel.countDocuments(matchQuery),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return ServiceResponse.success("Observers retrieved", {
      docs,
      totalDocs,
      totalPages,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  },
};
