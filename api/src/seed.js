import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { Trip } from './models/Trip.js';
import { Expense } from './models/Expense.js';
const destinations = ['Paris, France','New York, USA','Tokyo, Japan','Rome, Italy','London, UK','Toronto, Canada','Lisbon, Portugal','Vancouver, Canada','Barcelona, Spain','Montreal, Canada'];
const currencies = ['CAD','USD','EUR','GBP'];
try {
  await connectDB();
  await Expense.deleteMany({});
  await Trip.deleteMany({});
  const trips = await Trip.insertMany(Array.from({ length: 30 }, (_, i) => ({
    title: `${destinations[i % destinations.length].split(',')[0]} ${i < 10 ? 'Weekend' : i < 20 ? 'Adventure' : 'Holiday'}`,
    destination: destinations[i % destinations.length], startDate: '2027-04-10', endDate: '2027-04-15',
    budgetTotal: 1000 + i * 100, budgetCurrency: currencies[i % currencies.length], notes: 'Sample trip'
  })));
  const expenses = await Expense.insertMany(trips.flatMap(trip => [
    { tripId: trip._id, title: 'Airport train', category: 'transport', amountOriginal: 48, originalCurrency: trip.budgetCurrency, spentOn: '2027-04-10', convertedAmount: 48, fxRate: 1 },
    { tripId: trip._id, title: 'Lunch', category: 'food', amountOriginal: 35, originalCurrency: trip.budgetCurrency, spentOn: '2027-04-11', convertedAmount: 35, fxRate: 1 }
  ]));
  console.log(`Seeded ${trips.length} trips and ${expenses.length} expenses.`);
} catch (error) { console.error('Seed failed:', error.message); process.exitCode = 1; }
finally { await mongoose.disconnect(); }
