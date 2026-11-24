import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { app } from '../src/app.js';

test('trip/expense CRUD, validation, 404 and delete cascade', { skip: !process.env.MONGODB_TEST_URI }, async () => {
  mongoose.set('sanitizeFilter', true);
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  let createdId;
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, () => resolve(instance));
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const request = (path, method = 'GET', body) => fetch(`${origin}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  try {
    const list = await request('/api/trips');
    assert.equal(list.status, 200);
    assert.ok(Array.isArray((await list.json()).items));
    assert.equal((await request('/api/trips?sort=bad')).status, 400);

    const invalid = await request('/api/trips', 'POST', { title: '' });
    assert.equal(invalid.status, 400);
    assert.ok((await invalid.json()).error.details.title);

    const create = await request('/api/trips', 'POST', {
      title: 'Integration Test', destination: 'Ottawa, Canada',
      startDate: '2027-04-01', endDate: '2027-04-05', budgetTotal: 500, budgetCurrency: 'CAD'
    });
    assert.equal(create.status, 201);
    const trip = await create.json();
    assert.ok(trip.id);
    createdId = trip.id;

    const edit = await request(`/api/trips/${trip.id}`, 'PATCH', { budgetTotal: 750 });
    assert.equal(edit.status, 200);
    assert.equal((await edit.json()).budgetTotal, 750);

    const expenseCreate = await request('/api/expenses', 'POST', {
      tripId: trip.id, title: 'Bus fare', category: 'transport',
      amountOriginal: 15, originalCurrency: 'CAD', spentOn: '2027-04-01'
    });
    assert.equal(expenseCreate.status, 201);
    const expense = await expenseCreate.json();
    assert.equal(expense.convertedAmount, 15);
    assert.equal(expense.fxRate, 1);

    const expenseRead = await request(`/api/expenses/${expense.id}`);
    assert.equal(expenseRead.status, 200);
    assert.equal((await expenseRead.json()).trip.id, trip.id);

    const expenseEdit = await request(`/api/expenses/${expense.id}`, 'PATCH', { title: 'Train ticket' });
    assert.equal(expenseEdit.status, 200);
    assert.equal((await expenseEdit.json()).title, 'Train ticket');

    const expenseList = await request(`/api/expenses?tripId=${trip.id}`);
    assert.equal(expenseList.status, 200);
    assert.equal((await expenseList.json()).items.length, 1);

    const deleteTrip = await request(`/api/trips/${trip.id}`, 'DELETE');
    assert.equal(deleteTrip.status, 204);
    const childGone = await request(`/api/expenses/${expense.id}`);
    assert.equal(childGone.status, 404);

    assert.equal((await request('/api/trips/not-a-real-id')).status, 404);
    const unknownRoute = await request('/api/not-a-route');
    assert.equal(unknownRoute.status, 404);
    assert.equal(typeof (await unknownRoute.json()).error.message, 'string');
  } finally {
    if (createdId) await request(`/api/trips/${createdId}`, 'DELETE');
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
    await mongoose.disconnect();
  }
});
