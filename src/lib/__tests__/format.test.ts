import { formatDuration, gentleWhen } from '@/lib/format';

describe('formatDuration', () => {
  it('formats milliseconds as minutes and seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65_400)).toBe('1:05');
    expect(formatDuration(3_599_000)).toBe('59:59');
  });

  it('never displays negative time', () => {
    expect(formatDuration(-4_000)).toBe('0:00');
  });
});

describe('gentleWhen', () => {
  it('uses warm labels for today and yesterday', () => {
    const now = new Date('2026-06-28T12:00:00Z');

    expect(gentleWhen('2026-06-28T08:00:00Z', now)).toBe('Today');
    expect(gentleWhen('2026-06-27T08:00:00Z', now)).toBe('Yesterday');
  });
});
