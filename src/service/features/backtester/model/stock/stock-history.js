import {Schema, ObjectId} from 'mongoose';

export const StockHistory = new Schema({
    id: ObjectId,
    date: { type: Date },
    code: { type: String },
    open: { type: Number },
    close: { type: Number },
    low: { type: Number },
    high: { type: Number },
  })