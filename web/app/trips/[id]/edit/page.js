import { notFound } from 'next/navigation';
import { apiResponse } from '../../../../lib/server-api';
import TripForm from '../../../../components/TripForm';
import RememberTrip from '../../../../components/RememberTrip';
export const dynamic = 'force-dynamic';
export default async function EditTripPage({params}) {
  const {id}=await params;const response=await apiResponse(`/api/trips/${encodeURIComponent(id)}`);
  if(response.status===404)notFound();if(!response.ok)throw Error('Unable to load trip');
  const trip=await response.json();
  return <><RememberTrip id={trip.id}/><div className="page-header"><span className="eyebrow">EDIT TRIP</span><h1>Update {trip.title}</h1><p className="muted">Changes will appear as soon as you save.</p></div><TripForm trip={trip}/></>;
}
