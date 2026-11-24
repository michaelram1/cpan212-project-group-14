import mongoose from 'mongoose';
import { Expense } from '../models/Expense.js';
import { findTrip } from './trips.controller.js';
import { rateService } from '../services/rates.service.js';
import { HttpError } from '../lib/httpError.js';
import { createExpenseSchema, parseInput, requireNonEmptyUpdate, updateExpenseSchema } from '../validation/schemas.js';
async function findExpense(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw new HttpError(404, 'Expense not found');
  const expense = await Expense.findById(id);
  if (!expense) throw new HttpError(404, 'Expense not found');
  return expense;
}
// Keep tripId as a string for the existing frontend; expose populated data separately.
function populatedJSON(expense) {
  const item = expense.toJSON();
  const trip = item.tripId;
  item.tripId = trip ? String(trip.id || trip._id) : null;
  item.trip = trip;
  return item;
}
export async function listExpenses(req, res) {
  const filter = {};
  if (req.query.tripId !== undefined) filter.tripId = (await findTrip(req.query.tripId))._id;
  const rows = await Expense.find(filter).sort({ spentOn: 1, _id: 1 }).populate('tripId', 'title destination budgetCurrency');
  const items = rows.map(populatedJSON);
  res.json({ items, total: items.length, page: 1, limit: Math.max(1, items.length), totalPages: items.length ? 1 : 0 });
}
export async function getExpense(req, res) {
  const expense = await findExpense(req.params.id);
  await expense.populate('tripId', 'title destination budgetCurrency');
  res.json(populatedJSON(expense));
}
export async function createExpense(req, res) {
  const input = parseInput(createExpenseSchema, req.body);
  const trip = await findTrip(input.tripId);
  const fx = await rateService.convert(input.originalCurrency, trip.budgetCurrency, input.amountOriginal);
  res.status(201).json(await Expense.create({ ...input, convertedAmount: fx.convertedAmount, fxRate: fx.rate, fxRateDate: fx.rateDate }));
}
export async function updateExpense(req, res) {
  const item = await findExpense(req.params.id);
  const input = parseInput(updateExpenseSchema, req.body);
  requireNonEmptyUpdate(input);
  const trip = await findTrip(item.tripId);
  if (input.amountOriginal !== undefined || input.originalCurrency !== undefined) {
    const fx = await rateService.convert(input.originalCurrency ?? item.originalCurrency, trip.budgetCurrency, input.amountOriginal ?? item.amountOriginal);
    Object.assign(input, { convertedAmount: fx.convertedAmount, fxRate: fx.rate, fxRateDate: fx.rateDate });
  }
  const updated = await Expense.findByIdAndUpdate(item._id, input, { returnDocument: 'after', runValidators: true });
  if (!updated) throw new HttpError(404, 'Expense not found');
  res.json(updated);
}
export async function deleteExpense(req, res) {
  const item = await findExpense(req.params.id);
  await Expense.deleteOne({ _id: item._id });
  res.status(204).end();
}
