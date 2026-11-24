import mongoose from 'mongoose';
import { currencies } from '../validation/schemas.js';

export const dateField = { type: String, required: true, validate: { validator: v => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v, message: 'Enter a valid date (YYYY-MM-DD)' } };
export const positive = { type: Number, required: true, validate: { validator: v => Number.isFinite(v) && v > 0, message: 'Must be positive' } };
export const jsonOptions = { versionKey: false, transform(_doc, ret) { ret.id = String(ret._id); delete ret._id; } };
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 80 },
  destination: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  startDate: dateField, endDate: dateField,
  budgetTotal: positive,
  budgetCurrency: { type: String, required: true, enum: currencies, immutable: true },
  notes: { type: String, trim: true, maxlength: 500, default: '' }
}, { timestamps: true, toJSON: jsonOptions });
export const Trip = mongoose.model('Trip', schema);
