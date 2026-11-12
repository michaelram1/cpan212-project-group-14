import { randomUUID } from 'node:crypto';

const parisId = randomUUID();
const newYorkId = randomUUID();
const tokyoId = randomUUID();

// M2 specifically requires in-memory arrays with sample records.
// In M4 these arrays are replaced with Mongoose models.
export const trips = [
  { id: parisId, title: 'Paris Weekend', destination: 'Paris, France', startDate: '2027-04-10', endDate: '2027-04-15', budgetTotal: 1500, budgetCurrency: 'CAD', notes: 'Museum visits and cafés.', createdAt: new Date().toISOString() },
  { id: newYorkId, title: 'New York Escape', destination: 'New York, USA', startDate: '2027-06-05', endDate: '2027-06-09', budgetTotal: 1200, budgetCurrency: 'CAD', notes: 'A short city break.', createdAt: new Date().toISOString() },
  { id: tokyoId, title: 'Tokyo Spring', destination: 'Tokyo, Japan', startDate: '2027-05-03', endDate: '2027-05-14', budgetTotal: 3800, budgetCurrency: 'CAD', notes: '', createdAt: new Date().toISOString() }
];

export const expenses = [
  { id: randomUUID(), tripId: parisId, title: 'Airport train', category: 'transport', amountOriginal: 48, originalCurrency: 'CAD', spentOn: '2027-04-10', notes: '', convertedAmount: 48, fxRate: 1, fxRateDate: null, createdAt: new Date().toISOString() },
  { id: randomUUID(), tripId: parisId, title: 'Lunch reservation', category: 'food', amountOriginal: 65, originalCurrency: 'CAD', spentOn: '2027-04-11', notes: '', convertedAmount: 65, fxRate: 1, fxRateDate: null, createdAt: new Date().toISOString() },
  { id: randomUUID(), tripId: newYorkId, title: 'Museum ticket', category: 'activities', amountOriginal: 38, originalCurrency: 'CAD', spentOn: '2027-06-05', notes: '', convertedAmount: 38, fxRate: 1, fxRateDate: null, createdAt: new Date().toISOString() }
];
