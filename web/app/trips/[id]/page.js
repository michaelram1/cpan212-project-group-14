import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { apiResponse } from '../../../lib/server-api';
import RememberTrip from '../../../components/RememberTrip';
import TripExpenses from '../../../components/TripExpenses';
import { DeleteTrip } from '../../../components/DeleteButtons';

export const dynamic = 'force-dynamic';
export default async function TripDetailPage({params}) {
  const {id}=await params;
  // Resolve the trip before starting to stream any content. This keeps missing ids as real 404 responses.
  const response=await apiResponse(`/api/trips/${encodeURIComponent(id)}`);
  if(response.status===404)notFound();
  if(!response.ok)throw Error(`Trip request failed (${response.status})`);
  const trip=await response.json();
  return <>
    <RememberTrip id={trip.id}/>
    <section className="detail-header"><div><Link href="/trips" className="back-link">← All trips</Link><p className="eyebrow">TRIP DETAILS</p><h1>{trip.title}</h1><p className="muted">📍 {trip.destination} · {trip.startDate} to {trip.endDate}</p>{trip.notes&&<p className="muted">{trip.notes}</p>}</div><div className="actions"><Link className="button secondary" href={`/trips/${trip.id}/edit`}>Edit trip</Link><DeleteTrip id={trip.id}/></div></section>
    <Suspense fallback={<div className="loading-box" role="status">Loading expenses and budget totals…</div>}><TripExpenses trip={trip}/></Suspense>
  </>;
}
