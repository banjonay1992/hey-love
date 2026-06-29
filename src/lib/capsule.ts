export type CapsuleOption = { key: string; label: string; date: () => Date | null };

function nextChristmas(now = new Date()): Date {
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  const c = new Date(year, 11, 25, 8, 0, 0);
  if (c.getTime() <= now.getTime()) c.setFullYear(year + 1);
  return c;
}

function inYears(years: number, now = new Date()): Date {
  const d = new Date(now);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export const CAPSULE_OPTIONS: CapsuleOption[] = [
  { key: 'none', label: 'Keep it now', date: () => null },
  { key: 'christmas', label: 'This Christmas', date: () => nextChristmas() },
  { key: 'oneYear', label: 'One year from now', date: () => inYears(1) },
  { key: 'fiveYears', label: 'Five years from now', date: () => inYears(5) },
];
