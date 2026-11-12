import Link from 'next/link';
import { Suspense } from 'react';
import { apiJson } from '../../lib/server-api';
import TripCard from '../../components/TripCard';

export const dynamic = 'force-dynamic';
async function TripList(){
  const data=await apiJson('/api/trips');
  return data.items.length ? <div className="trip-grid">{data.items.map(trip=><TripCard key={trip.id} trip={trip}/>)}</div>
    : <div className="empty-box"><h2>No trips yet</h2><p>Create your first trip to start tracking a budget.</p><Link href="/trips/new" className="button">Create a trip</Link></div>;
}
export default function TripsPage(){return <>
  <section className="hero"><div><div className="eyebrow">YOUR TRAVEL PLANNER</div><h1>Plan better. Travel lighter.</h1><p>Keep your destinations, expenses and budgets in one simple place.</p></div><Link className="button" href="/trips/new">+ New trip</Link></section>
  <div className="section-heading"><div><h2>Your trips</h2><p className="muted">Choose a trip to view its spending and expenses.</p></div></div>
  <Suspense fallback={<div className="loading-box" role="status">Loading your trips…</div>}><TripList/></Suspense>
</>}
