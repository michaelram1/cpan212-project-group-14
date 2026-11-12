'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const empty = { title: '', destination: '', startDate: '', endDate: '', budgetTotal: '', budgetCurrency: 'CAD', notes: '' };
export default function TripForm({ trip = null }) {
  const router = useRouter();
  const isEdit = Boolean(trip);
  const [values, setValues] = useState(trip ? {
    title: trip.title, destination: trip.destination, startDate: trip.startDate, endDate: trip.endDate,
    budgetTotal: String(trip.budgetTotal), budgetCurrency: trip.budgetCurrency, notes: trip.notes || ''
  } : empty);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (name, value) => { setValues((v) => ({ ...v, [name]: value })); setErrors((e) => ({ ...e, [name]: undefined })); };

  async function submit(event) {
    event.preventDefault();
    setSaving(true); setErrors({}); setMessage('');
    const body = { title: values.title, destination: values.destination, startDate: values.startDate, endDate: values.endDate,
      budgetTotal: Number(values.budgetTotal), notes: values.notes };
    if (!isEdit) body.budgetCurrency = values.budgetCurrency;
    try {
      const response = await fetch(isEdit ? `/api/trips/${trip.id}` : '/api/trips', {
        method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.error?.details || {});
        setMessage(data.error?.message || 'Unable to save the trip.');
        return;
      }
      router.push(`/trips/${data.id}`);
      router.refresh();
    } catch { setMessage('Cannot reach the API. Is the Express server running?'); }
    finally { setSaving(false); }
  }

  return <form className="panel form" onSubmit={submit} noValidate>
    <div className="form-grid">
      <div className="form-group"><label htmlFor="title">Trip name</label><input id="title" required value={values.title} placeholder="Paris Weekend" onChange={e => set('title',e.target.value)}/>{errors.title && <span className="field-error">{errors.title}</span>}</div>
      <div className="form-group"><label htmlFor="destination">Destination</label><input id="destination" required value={values.destination} placeholder="Paris, France" onChange={e => set('destination',e.target.value)}/>{errors.destination && <span className="field-error">{errors.destination}</span>}</div>
      <div className="form-group"><label htmlFor="startDate">Start date</label><input id="startDate" type="date" required value={values.startDate} onChange={e => set('startDate',e.target.value)}/>{errors.startDate && <span className="field-error">{errors.startDate}</span>}</div>
      <div className="form-group"><label htmlFor="endDate">End date</label><input id="endDate" type="date" required value={values.endDate} onChange={e => set('endDate',e.target.value)}/>{errors.endDate && <span className="field-error">{errors.endDate}</span>}</div>
      <div className="form-group"><label htmlFor="budgetTotal">Budget amount</label><input id="budgetTotal" type="number" min="0.01" step="0.01" required value={values.budgetTotal} onChange={e => set('budgetTotal',e.target.value)} placeholder="1500" />{errors.budgetTotal && <span className="field-error">{errors.budgetTotal}</span>}</div>
      <div className="form-group"><label htmlFor="budgetCurrency">Budget currency</label><select id="budgetCurrency" disabled={isEdit} value={values.budgetCurrency} onChange={e => set('budgetCurrency',e.target.value)}>{['CAD','USD','EUR','GBP'].map(c => <option key={c}>{c}</option>)}</select>{isEdit && <span className="hint">Currency is fixed after creating a trip to protect saved expense values.</span>}</div>
      <div className="form-group wide"><label htmlFor="notes">Notes (optional)</label><textarea id="notes" rows="4" value={values.notes} onChange={e=>set('notes',e.target.value)} placeholder="What do you want to remember?"/>{errors.notes && <span className="field-error">{errors.notes}</span>}</div>
    </div>
    {message && <p className="error-banner" role="alert">{message}</p>}
    {errors._body && <p className="field-error">{errors._body}</p>}
    <div className="actions"><button className="button" type="submit" disabled={saving}>{saving ? 'Saving…' : isEdit ? 'Save trip' : 'Create trip'}</button><button className="button secondary" type="button" onClick={() => router.back()} disabled={saving}>Cancel</button></div>
  </form>;
}
