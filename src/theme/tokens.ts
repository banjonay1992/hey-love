/**
 * Hey, Love — design tokens.
 *
 * Every value here exists to make the app feel warm, quiet and human.
 * Earthy, calming palette. Generous spacing. Soft, slow edges.
 */

export const palette = {
  // Warm backgrounds — the colour of cream paper and morning light.
  cream: '#F6F0E6',
  paper: '#FBF7EF',
  oat: '#EDE4D3',
  linen: '#E7DCC8',

  // Quiet neutrals — stone, wood, soft charcoal.
  stone: '#C8BCA7',
  oak: '#A88B6A',
  bark: '#7A6A55',
  charcoal: '#48433B',
  ink: '#3A352E',

  // Botanical accents — used sparingly, like pressed flowers.
  moss: '#7C8A6B',
  sage: '#9AA98C',
  clay: '#B07C5B',
  terracotta: '#C08457',
  dustyRose: '#C99B96',

  // Faint washes for cards and boxes.
  roseWash: '#EFE0DC',
  sageWash: '#E2E6D8',
  clayWash: '#EEE0D2',
} as const;

export const colors = {
  background: palette.cream,
  surface: palette.paper,
  surfaceSunken: palette.oat,
  border: palette.linen,
  borderStrong: palette.stone,

  textPrimary: palette.ink,
  textSecondary: palette.bark,
  textMuted: palette.oak,

  accent: palette.clay,
  accentSoft: palette.terracotta,
  leaf: palette.moss,

  // Recording — a gentle, living warmth rather than an alarming red.
  recording: palette.clay,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 72,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const fonts = {
  // Elegant old-style serif for headings and emotional moments.
  serif: 'Fraunces_400Regular',
  serifMedium: 'Fraunces_500Medium',
  serifSoft: 'Fraunces_400Regular_Italic',
  // Highly readable, gentle sans for everything else.
  sans: 'NunitoSans_400Regular',
  sansMedium: 'NunitoSans_600SemiBold',
  sansBold: 'NunitoSans_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 46 },
  title: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 36 },
  heading: { fontFamily: fonts.serifMedium, fontSize: 22, lineHeight: 30 },
  serifBody: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 28 },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 25 },
  bodyMedium: { fontFamily: fonts.sansMedium, fontSize: 16, lineHeight: 25 },
  label: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 20 },
  small: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 19 },
  tiny: { fontFamily: fonts.sansMedium, fontSize: 11, lineHeight: 16, letterSpacing: 0.6 },
} as const;

/** A soft, barely-there shadow. Things should feel placed, not floating. */
export const softShadow = {
  shadowColor: palette.bark,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 2,
} as const;
