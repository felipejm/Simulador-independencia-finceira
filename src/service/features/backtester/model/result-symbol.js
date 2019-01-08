import {Schema, ObjectId} from 'mongoose';

export const ResultSymbol = new Schema({
    id: ObjectId,
    requestId: { type: String },
    status: { type: String },
    result: { type: String },
    params: { type: Object },
    
  }, {
    timestamps: true
  });