'use client';
import { useEffect } from 'react';
import { useSelectedTrip } from './TripSelectionProvider';
export default function RememberTrip({ id }) {
  const { setSelectedTripId } = useSelectedTrip();
  useEffect(() => setSelectedTripId(id), [id, setSelectedTripId]);
  return null;
}
