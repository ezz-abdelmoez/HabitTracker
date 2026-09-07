export function todayISO(now = new Date()): string { return now.toISOString().slice(0, 10); }
export function startOfWeek(iso: string, weekStartDay = 6): string {
  const d = new Date(iso); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() - weekStartDay + 7) % 7)); return d.toISOString().slice(0, 10);
}
