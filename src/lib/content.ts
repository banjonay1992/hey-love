import type { MemoryType } from '@/lib/types';

/** What a capture flow is trying to keep. Drives the recorder vs photo vs note UI. */
export type CaptureKind = 'voice' | 'someone' | 'pet' | 'moment' | 'thought' | 'photo' | 'later';

export type HomeOption = {
  kind: CaptureKind;
  label: string;
  hint: string;
  /** The underlying memory type produced. */
  baseType: MemoryType;
};

export type OnboardingPanel = {
  title: string;
  body: string;
};

export const HOME_OPTIONS: HomeOption[] = [
  { kind: 'voice', label: 'A voice', hint: 'Keep the sound of someone speaking', baseType: 'voice' },
  { kind: 'someone', label: 'Someone I love', hint: 'A person to remember', baseType: 'voice' },
  { kind: 'pet', label: 'A pet', hint: 'Their little noises and ways', baseType: 'voice' },
  { kind: 'moment', label: 'A little moment', hint: 'Something ordinary and lovely', baseType: 'voice' },
  { kind: 'thought', label: 'A thought', hint: 'A few words for later', baseType: 'note' },
  { kind: 'photo', label: 'A photograph', hint: 'A picture worth keeping', baseType: 'photo' },
  { kind: 'later', label: 'Something for later', hint: 'A message that waits for a day', baseType: 'voice' },
];

export const ONBOARDING_PANELS: OnboardingPanel[] = [
  {
    title: 'Hey, Love.',
    body: 'This is a quiet place for the voices, sounds and little moments you never want to lose.',
  },
  {
    title: 'Ordinary, made precious.',
    body: 'A laugh in the kitchen. A pet’s purr. Rain on the window. The way someone says your name.',
  },
  {
    title: 'Yours, and only yours.',
    body: 'Everything stays on your device. No feeds. No likes. No pressure. Just what matters to you.',
  },
  {
    title: 'Then go and live it.',
    body: 'Keep a memory, close the app, and return to the moment. Hey, Love will keep it safe.',
  },
];

export const PROMPTS: string[] = [
  'What made you smile today?',
  'Describe the room you’re in.',
  'Tell future you about today.',
  'Record the sound around you.',
  'What are you grateful for?',
  'Describe someone you love.',
  'Tell the story behind this photo.',
  'What’s something ordinary you’ll probably miss one day?',
  'What made today feel like home?',
  'What do you hope your future self remembers?',
  'What are you excited for?',
];

export const PET_PROMPTS: string[] = [
  'Record their purr.',
  'Record their bark.',
  'Record their little noises.',
  'Describe their personality.',
  'Tell their story.',
  'Record them sleeping.',
  'Record the way they greet you.',
  'Record their favourite toy.',
];

export const TODAYS_SOUNDS: string[] = [
  'Rain against the window',
  'Birdsong in the morning',
  'The kettle boiling',
  'The family eating dinner',
  'A crackling fire',
  'A cat purring',
  'Children laughing',
  'The quiet of your home',
];

export function promptFor(kind: CaptureKind): string {
  if (kind === 'pet') return random(PET_PROMPTS);
  return random(PROMPTS);
}

export function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** A gentle, time-aware greeting. Never mentions how long it has been. */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 5) return 'Hey, Love.';
  if (h < 12) return 'Good morning, Love.';
  if (h < 17) return 'Hello, Love.';
  if (h < 21) return 'Good evening, Love.';
  return 'Hey, Love.';
}
