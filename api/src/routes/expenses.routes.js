import { Router } from 'express';
import { listExpenses, getExpense, createExpense, updateExpense, deleteExpense } from '../controllers/expenses.controller.js';
export const expensesRouter = Router();
expensesRouter.get('/', listExpenses);
expensesRouter.get('/:id', getExpense);
expensesRouter.post('/', createExpense);
expensesRouter.patch('/:id', updateExpense);
expensesRouter.delete('/:id', deleteExpense);
