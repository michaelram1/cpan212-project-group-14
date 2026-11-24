'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function TripListControls({ currency, sort }) {
  const router = useRouter();
  const [selectedCurrency, setCurrency] = useState(currency);
  const [selectedSort, setSort] = useState(sort);
  function apply(event) {
    event.preventDefault();
    const query = new URLSearchParams({ sort: selectedSort, page: '1' });
    if (selectedCurrency) query.set('currency', selectedCurrency);
    router.push(`/trips?${query.toString()}`);
  }
  return <form className="panel trip-filters" onSubmit={apply}>
    <label>Budget currency<select value={selectedCurrency} onChange={e => setCurrency(e.target.value)}><option value="">All currencies</option>{['CAD','USD','EUR','GBP'].map(c => <option key={c}>{c}</option>)}</select></label>
    <label>Sort by<select value={selectedSort} onChange={e => setSort(e.target.value)}>
      <option value="-createdAt">Newest first</option><option value="createdAt">Oldest first</option><option value="title">Title A–Z</option><option value="-title">Title Z–A</option><option value="destination">Destination A–Z</option><option value="-destination">Destination Z–A</option><option value="startDate">Start date (earliest)</option><option value="-startDate">Start date (latest)</option><option value="budgetTotal">Budget (low to high)</option><option value="-budgetTotal">Budget (high to low)</option>
    </select></label>
    <button className="button" type="submit">Apply</button>
  </form>;
}
