export function formatDuration(millis = 0): string {
  const total = Math.max(0, Math.round(millis / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Warm, human relative phrasing — never guilt-inducing. */
export function gentleWhen(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return formatDate(iso);
}
