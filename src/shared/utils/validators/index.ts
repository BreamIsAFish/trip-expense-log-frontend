export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isPositiveDecimalString(v: string): boolean {
  const n = Number.parseFloat(v);
  return !Number.isNaN(n) && n > 0;
}
