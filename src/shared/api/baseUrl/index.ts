export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL;
  if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
    return String(raw).replace(/\/$/, "");
  }
  return `${window.location.origin}/api`;
}
