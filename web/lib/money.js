export function money(value, currency='CAD') {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency }).format(Number(value || 0));
}

export function tripProgress(spent, budget) {
  return budget > 0 ? Math.min(100, Math.max(0, (spent / budget) * 100)) : 0;
}
