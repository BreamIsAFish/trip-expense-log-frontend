export function formatCurrency(amount: string, currency = "THB"): string {
  const n = Number.parseFloat(amount);
  if (Number.isNaN(n)) {
    return amount;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return d.toLocaleString();
}
