import Link from 'next/link';
import { apiJson } from '../lib/server-api';
import { money, tripProgress } from '../lib/money';
import { DeleteExpense } from './DeleteButtons';

export default async function TripExpenses({ trip }) {
  const result = await apiJson(`/api/expenses?tripId=${encodeURIComponent(trip.id)}`);
  const items = result.items;
  const spent = items.reduce((acc,e)=>acc+e.convertedAmount,0);
  const remaining = trip.budgetTotal - spent;
  return <>
    <section className="summary-grid" aria-label="Trip spending summary">
      <article className="summary-box"><span className="muted">Trip budget</span><strong>{money(trip.budgetTotal,trip.budgetCurrency)}</strong></article>
      <article className="summary-box"><span className="muted">Spent so far</span><strong>{money(spent,trip.budgetCurrency)}</strong></article>
      <article className={`summary-box ${remaining<0?'over-budget':''}`}><span className="muted">{remaining<0?'Over budget by':'Remaining'}</span><strong>{money(Math.abs(remaining),trip.budgetCurrency)}</strong></article>
    </section>
    <div className="progress-track" aria-label="Percentage of budget used"><span style={{width:`${tripProgress(spent,trip.budgetTotal)}%`}}/></div>
    <div className="section-heading"><div><h2>Expenses</h2><p className="muted">Amounts below are shown in their original currency and your trip budget currency.</p></div><Link className="button" href={`/trips/${trip.id}/expenses/new`}>+ Add expense</Link></div>
    {items.length===0 ? <div className="empty-box"><h3>No expenses yet</h3><p>Add your first expense to see your budget update.</p></div> : <div className="panel expense-list">
      {items.map(e=><div className="expense-row" key={e.id}>
        <div className="expense-avatar" aria-hidden="true">{({food:'🍽',lodging:'🏨',transport:'🚆',activities:'🎟',shopping:'🛍',other:'•'})[e.category]}</div>
        <div className="expense-primary"><strong>{e.title}</strong><span className="muted small">{e.category} · {e.spentOn}</span></div>
        <div className="expense-amount"><strong>{money(e.convertedAmount,trip.budgetCurrency)}</strong><span className="muted small">{money(e.amountOriginal,e.originalCurrency)}{e.fxRateDate?` · rate ${e.fxRateDate}`:''}</span></div>
        <div className="expense-actions"><Link href={`/expenses/${e.id}/edit`} className="text-button">Edit</Link><DeleteExpense id={e.id}/></div>
      </div>)}
    </div>}
  </>;
}
