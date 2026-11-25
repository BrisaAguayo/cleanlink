const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

/** $1,234.50 */
export function formatMoney(amount: number) {
  return money.format(amount);
}

/** 'AAAA-MM-DD' como fecha local ("2 dic 2026"), sin desfase de zona horaria. */
export function formatDate(text: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const [year, month, day] = text.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-MX', options);
}

/** Fecha local en formato 'AAAA-MM-DD', a `daysAhead` días de hoy. */
export function isoDate(daysAhead = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
