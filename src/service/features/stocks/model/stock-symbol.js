import {Schema, ObjectId} from 'mongoose';

export const StockSymbol = new Schema({
    id: ObjectId,
    code: { type: String },
  });