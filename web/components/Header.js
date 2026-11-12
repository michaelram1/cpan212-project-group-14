'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelectedTrip } from './TripSelectionProvider';

export default function Header() {
  const pathname = usePathname();
  const { selectedTripId } = useSelectedTrip();
  return <header className="header">
    <div className="header-inner">
      <Link href="/trips" className="brand" aria-label="TripTally home"><span className="brand-icon">✈</span> TripTally</Link>
      <nav className="nav" aria-label="Main navigation">
        <Link href="/trips" className={pathname === '/trips' ? 'active' : ''}>Trips</Link>
        <Link href="/trips/new" className={pathname === '/trips/new' ? 'active' : ''}>New trip</Link>
        {selectedTripId && <>
          <Link href={`/trips/${selectedTripId}`}>Current trip</Link>
          <Link href={`/trips/${selectedTripId}/edit`}>Edit trip</Link>
        </>}
      </nav>
    </div>
  </header>;
}
