'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteTrip({ id }) {
  const router = useRouter(); const [busy,setBusy] = useState(false); const [error,setError]=useState('');
  async function remove(){
    if (!window.confirm('Delete this trip and all of its expenses?')) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/trips/${id}`, {method:'DELETE'});
      if(!response.ok) throw Error('Delete failed');
      router.push('/trips'); router.refresh();
    } catch {setError('Could not delete trip. Try again.');} finally {setBusy(false);}
  }
  return <><button type="button" className="button danger-outline" onClick={remove} disabled={busy}>{busy?'Deleting…':'Delete trip'}</button>{error&&<span className="field-error" role="alert">{error}</span>}</>;
}
export function DeleteExpense({ id }) {
  const router=useRouter();const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  async function remove(){
    if (!window.confirm('Delete this expense?')) return;
    setBusy(true);
    try{const response=await fetch(`/api/expenses/${id}`,{method:'DELETE'});if(!response.ok)throw Error('Delete failed');router.refresh();}
    catch{setError('Could not delete expense.');}finally{setBusy(false);}
  }
  return <><button type="button" className="text-button danger" disabled={busy} onClick={remove}>{busy?'Deleting…':'Delete'}</button>{error&&<span className="field-error" role="alert">{error}</span>}</>;
}
