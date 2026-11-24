import { z } from 'zod';
import { HttpError } from '../lib/httpError.js';

export const currencies = ['CAD', 'USD', 'EUR', 'GBP'];
export const categories = ['transport', 'lodging', 'food', 'activities', 'shopping', 'other'];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').refine(
  (date) => !Number.isNaN(Date.parse(`${date}T00:00:00.000Z`)) && new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) === date,
  'Enter a valid date'
);

const tripFields = z.object({
  title: z.string().trim().min(3).max(80),
  destination: z.string().trim().min(2).max(80),
  startDate: isoDate,
  endDate: isoDate,
  budgetTotal: z.number().finite().positive(),
  budgetCurrency: z.enum(currencies),
  notes: z.string().trim().max(500).optional().default('')
}).strict();

export const createTripSchema = tripFields;
export const updateTripSchema = tripFields.omit({ budgetCurrency: true, notes: true }).partial().extend({ notes: z.string().trim().max(500).optional() }).strict();

const expenseFields = z.object({
  tripId: z.string(),
  title: z.string().trim().min(2).max(80),
  category: z.enum(categories),
  amountOriginal: z.number().finite().positive(),
  originalCurrency: z.enum(currencies),
  spentOn: isoDate,
  notes: z.string().trim().max(300).optional().default('')
}).strict();
export const createExpenseSchema = expenseFields;
export const updateExpenseSchema = expenseFields.omit({ tripId: true, notes: true }).partial().extend({ notes: z.string().trim().max(300).optional() }).strict();
export const previewRateSchema = z.object({
  from: z.enum(currencies),
  to: z.enum(currencies),
  amount: z.coerce.number().finite().positive()
}).strict();

export function parseInput(schema, input) {
  const parsed = schema.safeParse(input);
  if (parsed.success) return parsed.data;
  const details = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? '_body');
    if (!details[key]) details[key] = issue.message;
  }
  throw new HttpError(400, 'Validation failed', details);
}

export function validateTripDates(trip) {
  if (trip.endDate < trip.startDate) {
    throw new HttpError(400, 'Validation failed', { endDate: 'End date must be on or after the start date' });
  }
}

export function requireNonEmptyUpdate(value) {
  if (Object.keys(value).length === 0) {
    throw new HttpError(400, 'Validation failed', { _body: 'Provide at least one field to update' });
  }
}
