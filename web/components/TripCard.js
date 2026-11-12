'use client';
import Link from 'next/link';
import { money } from '../lib/money';
import { useSelectedTrip } from './TripSelectionProvider';

export default function TripCard({ trip }) {
  const { setSelectedTripId } = useSelectedTrip();
  return <Link className="trip-card" href={`/trips/${trip.id}`} onClick={() => setSelectedTripId(trip.id)}>
    <div className="card-head"><span className="eyebrow">TRIP</span><span className="pill">{trip.budgetCurrency}</span></div>
    <h2>{trip.title}</h2>
    <p className="muted">{trip.destination}</p>
    <p className="card-dates">{trip.startDate} — {trip.endDate}</p>
    <div className="card-bottom"><div><span className="muted small">Budget</span><strong>{money(trip.budgetTotal, trip.budgetCurrency)}</strong></div><span className="card-arrow">View trip ↗</span></div>
  </Link>;
}
