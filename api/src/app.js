import express from 'express';
import { tripsRouter } from './routes/trips.routes.js';
import { expensesRouter } from './routes/expenses.routes.js';
import { ratesRouter } from './routes/rates.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();
app.use(express.json());
app.use('/api/trips', tripsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/rates', ratesRouter);
app.use(notFound);
app.use(errorHandler);
