import { randomUUID } from 'node:crypto';
import { expenses, trips } from '../data/store.js';
import { HttpError } from '../lib/httpError.js';
import { createTripSchema, parseInput, requireNonEmptyUpdate, updateTripSchema, validateTripDates } from '../validation/schemas.js';

export function findTrip(id) {
  const trip = trips.find((row) => row.id === id);
  if (!trip) throw new HttpError(404, 'Trip not found');
  return trip;
}

export function listTrips(req, res) {
  res.json({ items: trips, total: trips.length, page: 1, limit: Math.max(1, trips.length), totalPages: trips.length > 0 ? 1 : 0 });
}
export function getTrip(req, res) {
  res.json(findTrip(req.params.id));
}
export function createTrip(req, res) {
  const input = parseInput(createTripSchema, req.body);
  validateTripDates(input);
  const trip = { id: randomUUID(), ...input, createdAt: new Date().toISOString() };
  trips.push(trip);
  res.status(201).json(trip);
}
export function updateTrip(req, res) {
  const trip = findTrip(req.params.id);
  const input = parseInput(updateTripSchema, req.body);
  requireNonEmptyUpdate(input);
  validateTripDates({ ...trip, ...input });
  Object.assign(trip, input);
  res.json(trip);
}
export function deleteTrip(req, res) {
  findTrip(req.params.id);
  const i = trips.findIndex((row) => row.id === req.params.id);
  trips.splice(i, 1);
  for (let j = expenses.length - 1; j >= 0; j--) {
    if (expenses[j].tripId === req.params.id) expenses.splice(j, 1);
  }
  res.status(204).end();
}
