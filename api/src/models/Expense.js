import mongoose from 'mongoose';
import { currencies, categories } from '../validation/schemas.js';
import { dateField, positive, jsonOptions } from './Trip.js';
const schema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, immutable: true, index: true },
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  category: { type: String, required: true, enum: categories },
  amountOriginal: positive,
  originalCurrency: { type: String, required: true, enum: currencies },
  spentOn: dateField,
  notes: { type: String, trim: true, maxlength: 300, default: '' },
  convertedAmount: { type: Number, required: true, min: 0 },
  fxRate: positive,
  fxRateDate: { type: String, default: null }
}, { timestamps: true, toJSON: jsonOptions });
export const Expense = mongoose.model('Expense', schema);
