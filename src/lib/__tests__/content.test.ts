import { greeting, HOME_OPTIONS, ONBOARDING_PANELS } from '@/lib/content';

describe('greeting', () => {
  it('matches the quiet time-of-day voice', () => {
    expect(greeting(new Date('2026-06-28T04:00:00'))).toBe('Hey, Love.');
    expect(greeting(new Date('2026-06-28T09:00:00'))).toBe('Good morning, Love.');
    expect(greeting(new Date('2026-06-28T14:00:00'))).toBe('Hello, Love.');
    expect(greeting(new Date('2026-06-28T19:00:00'))).toBe('Good evening, Love.');
  });
});

describe('HOME_OPTIONS', () => {
  it('keeps each capture kind unique', () => {
    const kinds = HOME_OPTIONS.map((option) => option.kind);

    expect(new Set(kinds).size).toBe(kinds.length);
  });
});

describe('ONBOARDING_PANELS', () => {
  it('keeps the welcome journey concise and in order', () => {
    expect(ONBOARDING_PANELS.map((panel) => panel.title)).toEqual([
      'Hey, Love.',
      'Ordinary, made precious.',
      'Yours, and only yours.',
      'Then go and live it.',
    ]);
    expect(ONBOARDING_PANELS).toHaveLength(4);
  });
});
