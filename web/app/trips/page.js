import Link from 'next/link';
import { Suspense } from 'react';
import { apiJson } from '../../lib/server-api';
import TripCard from '../../components/TripCard';
import TripListControls from '../../components/TripListControls';
export const dynamic = 'force-dynamic';
async function TripList({ query }) {
  const data = await apiJson(`/api/trips?${query.toString()}`);
  function pageUrl(page) {
    const next = new URLSearchParams(query); next.set('page', String(page));
    return `/trips?${next.toString()}`;
  }
  return <>
    <p className="muted">{data.total} matching trips</p>
    {data.items.length ? <div className="trip-grid">{data.items.map(trip => <TripCard key={trip.id} trip={trip}/>)}</div>
      : <div className="empty-box"><h2>No trips on this page</h2><p>Change the filter or create a trip.</p><Link href="/trips/new" className="button">Create a trip</Link></div>}
    <nav className="trip-pagination" aria-label="Trip pages">
      {data.page > 1 && <Link href={pageUrl(Math.max(1, Math.min(data.page - 1, data.totalPages)))}>Previous</Link>}
      <span>Page {data.totalPages ? data.page : 0} of {data.totalPages}</span>
      {data.page < data.totalPages && <Link href={pageUrl(data.page + 1)}>Next</Link>}
    </nav>
  </>;
}
export default async function TripsPage({ searchParams }) {
  const params = await searchParams;
  const query = new URLSearchParams();
  const currency = ['CAD','USD','EUR','GBP'].includes(params.currency) ? params.currency : '';
  const sort = ['title','-title','destination','-destination','startDate','-startDate','budgetTotal','-budgetTotal','createdAt','-createdAt'].includes(params.sort) ? params.sort : '-createdAt';
  const page = typeof params.page === 'string' && /^\d+$/.test(params.page) && Number.isSafeInteger(Number(params.page)) && Number(params.page) > 0 ? params.page : '1';
  if (currency) query.set('currency', currency);
  query.set('sort', sort); query.set('page', page); query.set('limit', '10');
  return <>
    <section className="hero"><div><div className="eyebrow">YOUR TRAVEL PLANNER</div><h1>Plan better. Travel lighter.</h1><p>Keep your destinations, expenses and budgets in one simple place.</p></div><Link className="button" href="/trips/new">+ New trip</Link></section>
    <div className="section-heading"><div><h2>Your trips</h2><p className="muted">Choose a trip to view its spending and expenses.</p></div></div>
    <TripListControls key={`${currency}:${sort}`} currency={currency} sort={sort}/>
    <Suspense key={query.toString()} fallback={<div className="loading-box" role="status">Loading your trips…</div>}><TripList query={query}/></Suspense>
  </>;
}
