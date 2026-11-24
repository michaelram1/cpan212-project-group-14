import mongoose from 'mongoose';
import { Trip } from '../models/Trip.js';
import { Expense } from '../models/Expense.js';
import { HttpError } from '../lib/httpError.js';
import { currencies, createTripSchema, parseInput, requireNonEmptyUpdate, updateTripSchema, validateTripDates } from '../validation/schemas.js';

export async function findTrip(id) {
  if (!mongoose.isObjectIdOrHexString(id)) throw new HttpError(404, 'Trip not found');
  const trip = await Trip.findById(id);
  if (!trip) throw new HttpError(404, 'Trip not found');
  return trip;
}
const sortFields = ['title', 'destination', 'startDate', 'budgetTotal', 'createdAt'];
function integer(value, fallback, field) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) {
    throw new HttpError(400, 'Validation failed', { [field]: 'Enter a positive integer' });
  }
  return Number(value);
}
export async function listTrips(req, res) {
  const { currency, sort = '-createdAt' } = req.query;
  const filter = {};
  if (currency !== undefined && currency !== '') {
    if (!currencies.includes(currency)) throw new HttpError(400, 'Validation failed', { currency: 'Invalid currency' });
    filter.budgetCurrency = currency;
  }
  if (typeof sort !== 'string' || !sortFields.includes(sort.replace(/^-/, ''))) throw new HttpError(400, 'Validation failed', { sort: 'Invalid sort field' });
  const page = integer(req.query.page, 1, 'page');
  const limit = Math.min(integer(req.query.limit, 10, 'limit'), 50);
  const total = await Trip.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);
  const items = page > totalPages ? [] : await Trip.find(filter).sort({ [sort.replace(/^-/, '')]: sort.startsWith('-') ? -1 : 1, _id: 1 }).skip((page - 1) * limit).limit(limit);
  res.json({ items, total, page, limit, totalPages });
}
export async function getTrip(req, res) { res.json(await findTrip(req.params.id)); }
export async function createTrip(req, res) {
  const input = parseInput(createTripSchema, req.body);
  validateTripDates(input);
  res.status(201).json(await Trip.create(input));
}
export async function updateTrip(req, res) {
  const trip = await findTrip(req.params.id);
  const input = parseInput(updateTripSchema, req.body);
  requireNonEmptyUpdate(input);
  validateTripDates({ ...trip.toObject(), ...input });
  const updated = await Trip.findByIdAndUpdate(trip._id, input, { returnDocument: 'after', runValidators: true });
  if (!updated) throw new HttpError(404, 'Trip not found');
  res.json(updated);
}
export async function deleteTrip(req, res) {
  const trip = await findTrip(req.params.id);
  await Expense.deleteMany({ tripId: trip._id });
  await Trip.deleteOne({ _id: trip._id });
  res.status(204).end();
}
