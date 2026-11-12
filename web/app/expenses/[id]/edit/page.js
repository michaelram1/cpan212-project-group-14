import { notFound } from 'next/navigation';
import { apiResponse } from '../../../../lib/server-api';
import ExpenseForm from '../../../../components/ExpenseForm';
import RememberTrip from '../../../../components/RememberTrip';
export const dynamic='force-dynamic';
export default async function EditExpensePage({params}){
  const {id}=await params;const expenseResponse=await apiResponse(`/api/expenses/${encodeURIComponent(id)}`);
  if(expenseResponse.status===404)notFound();if(!expenseResponse.ok)throw Error('Unable to load expense');
  const expense=await expenseResponse.json();
  const tripResponse=await apiResponse(`/api/trips/${encodeURIComponent(expense.tripId)}`);
  if(tripResponse.status===404)notFound();if(!tripResponse.ok)throw Error('Unable to load trip');
  const trip=await tripResponse.json();
  return <><RememberTrip id={trip.id}/><div className="page-header"><span className="eyebrow">EDIT EXPENSE</span><h1>Update {expense.title}</h1><p className="muted">Trip budget: {trip.budgetCurrency}</p></div><ExpenseForm trip={trip} expense={expense}/></>;
}
