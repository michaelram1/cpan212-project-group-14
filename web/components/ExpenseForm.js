'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { money } from '../lib/money';

const categories = ['transport','lodging','food','activities','shopping','other'];
export default function ExpenseForm({ trip, expense = null }) {
  const router = useRouter();
  const isEdit = Boolean(expense);
  const [values, setValues] = useState(expense ? {
    title: expense.title, category: expense.category, amountOriginal: String(expense.amountOriginal),
    originalCurrency: expense.originalCurrency, spentOn: expense.spentOn, notes: expense.notes || ''
  } : { title: '', category:'food', amountOriginal:'', originalCurrency:trip.budgetCurrency, spentOn:trip.startDate, notes:'' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState(null);
  const set = (name, value) => { setValues(v=>({...v,[name]:value}));setErrors(e=>({...e,[name]:undefined}));setPreview(null); };

  async function previewConversion() {
    setPreviewing(true); setPreview(null); setMessage('');
    try {
      const params = new URLSearchParams({ from: values.originalCurrency, to: trip.budgetCurrency, amount: String(values.amountOriginal) });
      const response = await fetch(`/api/rates?${params}`);
      const data = await response.json();
      if (!response.ok) { setErrors(data.error?.details || {}); setMessage(data.error?.message || 'Conversion failed.'); return; }
      setPreview(data);
    } catch { setMessage('Cannot reach the API to preview the conversion.'); }
    finally { setPreviewing(false); }
  }

  async function submit(event) {
    event.preventDefault(); setSaving(true); setErrors({}); setMessage('');
    const body = { title:values.title, category:values.category, amountOriginal:Number(values.amountOriginal), originalCurrency:values.originalCurrency, spentOn:values.spentOn, notes:values.notes };
    if (!isEdit) body.tripId = trip.id;
    try {
      const response = await fetch(isEdit ? `/api/expenses/${expense.id}` : '/api/expenses', {
        method:isEdit ? 'PATCH' : 'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) { setErrors(data.error?.details || {});setMessage(data.error?.message || 'Unable to save the expense.');return; }
      router.push(`/trips/${trip.id}`);router.refresh();
    } catch { setMessage('Cannot reach the API. Is Express running?'); }
    finally { setSaving(false); }
  }

  return <form className="panel form" onSubmit={submit} noValidate>
    <div className="form-grid">
      <div className="form-group"><label htmlFor="expense-title">Expense title</label><input id="expense-title" value={values.title} onChange={e=>set('title',e.target.value)} placeholder="Airport train"/>{errors.title && <span className="field-error">{errors.title}</span>}</div>
      <div className="form-group"><label htmlFor="category">Category</label><select id="category" value={values.category} onChange={e=>set('category',e.target.value)}>{categories.map(c=><option value={c} key={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}</select>{errors.category && <span className="field-error">{errors.category}</span>}</div>
      <div className="form-group"><label htmlFor="amountOriginal">Original amount</label><input id="amountOriginal" type="number" min="0.01" step="0.01" value={values.amountOriginal} onChange={e=>set('amountOriginal',e.target.value)} placeholder="50"/>{errors.amountOriginal && <span className="field-error">{errors.amountOriginal}</span>}{errors.amount && <span className="field-error">{errors.amount}</span>}</div>
      <div className="form-group"><label htmlFor="originalCurrency">Original currency</label><select id="originalCurrency" value={values.originalCurrency} onChange={e=>set('originalCurrency',e.target.value)}>{['CAD','USD','EUR','GBP'].map(c=><option key={c}>{c}</option>)}</select>{errors.originalCurrency && <span className="field-error">{errors.originalCurrency}</span>}</div>
      <div className="form-group"><label htmlFor="spentOn">Date spent</label><input id="spentOn" type="date" value={values.spentOn} onChange={e=>set('spentOn',e.target.value)}/>{errors.spentOn && <span className="field-error">{errors.spentOn}</span>}</div>
      <div className="form-group wide"><label htmlFor="expense-notes">Notes (optional)</label><textarea id="expense-notes" rows="3" value={values.notes} onChange={e=>set('notes',e.target.value)}/>{errors.notes && <span className="field-error">{errors.notes}</span>}</div>
    </div>
    <section className="fx-box" aria-label="Currency conversion preview">
      <div><h3>Currency preview</h3><p className="muted small">View reference-rate conversion into your trip budget currency ({trip.budgetCurrency}).</p></div>
      <button type="button" className="button secondary" onClick={previewConversion} disabled={saving || previewing}>{previewing ? 'Checking…' : 'Preview conversion'}</button>
      {preview && <div className="preview-result" role="status"><strong>{money(preview.convertedAmount,trip.budgetCurrency)}</strong><span>Rate: {preview.rate} · Date: {preview.rateDate || 'Same currency'}</span></div>}
      <p className="hint">Frankfurter rates are published reference rates, not guaranteed card settlement amounts. The API recalculates the rate when you save.</p>
    </section>
    {message && <p className="error-banner" role="alert">{message}</p>}
    {errors._body && <p className="field-error">{errors._body}</p>}
    <div className="actions"><button type="submit" className="button" disabled={saving || previewing}>{saving ? 'Saving…' : isEdit ? 'Save expense' : 'Add expense'}</button><button type="button" className="button secondary" onClick={()=>router.back()} disabled={saving}>Cancel</button></div>
  </form>;
}
