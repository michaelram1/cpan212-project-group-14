import { notFound } from 'next/navigation';
import { apiResponse } from '../../../../../lib/server-api';
import ExpenseForm from '../../../../../components/ExpenseForm';
import RememberTrip from '../../../../../components/RememberTrip';
export const dynamic='force-dynamic';
export default async function NewExpensePage({params}){
  const {id}=await params;const response=await apiResponse(`/api/trips/${encodeURIComponent(id)}`);
  if(response.status===404)notFound();if(!response.ok)throw Error('Unable to load trip');
  const trip=await response.json();
  return <><RememberTrip id={trip.id}/><div className="page-header"><span className="eyebrow">NEW EXPENSE</span><h1>Add spending to {trip.title}</h1><p className="muted">Foreign-currency amounts are converted into your {trip.budgetCurrency} trip budget.</p></div><ExpenseForm trip={trip}/></>;
}
