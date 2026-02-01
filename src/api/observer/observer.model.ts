import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import type { IObserver } from "./observer.types.js";

const observerSchema = new Schema<IObserver>(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    pageRoute: {
      type: String,
      required: true,
      index: true,
    },
    metaData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

observerSchema.plugin(mongoosePaginate);

export const ObserverModel = mongoose.model<IObserver>("Observer", observerSchema);
