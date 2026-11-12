import { randomUUID } from 'node:crypto';
import { expenses } from '../data/store.js';
import { findTrip } from './trips.controller.js';
import { rateService } from '../services/rates.service.js';
import { HttpError } from '../lib/httpError.js';
import { createExpenseSchema, parseInput, requireNonEmptyUpdate, updateExpenseSchema } from '../validation/schemas.js';

function findExpense(id) {
  const expense = expenses.find((row) => row.id === id);
  if (!expense) throw new HttpError(404, 'Expense not found');
  return expense;
}

export function listExpenses(req, res) {
  if (req.query.tripId) findTrip(req.query.tripId);
  const filtered = req.query.tripId ? expenses.filter((row) => row.tripId === req.query.tripId) : expenses;
  res.json({ items: filtered, total: filtered.length, page: 1, limit: Math.max(1, filtered.length), totalPages: filtered.length > 0 ? 1 : 0 });
}
export function getExpense(req, res) {
  res.json(findExpense(req.params.id));
}
export async function createExpense(req, res) {
  const input = parseInput(createExpenseSchema, req.body);
  const trip = findTrip(input.tripId);
  const fx = await rateService.convert(input.originalCurrency, trip.budgetCurrency, input.amountOriginal);
  const item = { id: randomUUID(), ...input, convertedAmount: fx.convertedAmount, fxRate: fx.rate, fxRateDate: fx.rateDate, createdAt: new Date().toISOString() };
  expenses.push(item);
  res.status(201).json(item);
}
export async function updateExpense(req, res) {
  const item = findExpense(req.params.id);
  const input = parseInput(updateExpenseSchema, req.body);
  requireNonEmptyUpdate(input);
  const next = { ...item, ...input };
  const trip = findTrip(item.tripId);
  if (input.amountOriginal !== undefined || input.originalCurrency !== undefined) {
    const fx = await rateService.convert(next.originalCurrency, trip.budgetCurrency, next.amountOriginal);
    Object.assign(next, { convertedAmount: fx.convertedAmount, fxRate: fx.rate, fxRateDate: fx.rateDate });
  }
  Object.assign(item, next);
  res.json(item);
}
export function deleteExpense(req, res) {
  findExpense(req.params.id);
  expenses.splice(expenses.findIndex((row) => row.id === req.params.id), 1);
  res.status(204).end();
}
