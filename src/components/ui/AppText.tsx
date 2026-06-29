import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, type as typography } from '@/theme/tokens';

type Variant = keyof typeof typography;

export type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
  center?: boolean;
};

/**
 * The single way text appears in Hey, Love.
 * Defaults to gentle body sans; switch to serif variants for emotional moments.
 */
export function AppText({
  variant = 'body',
  color = colors.textPrimary,
  center,
  style,
  ...rest
}: AppTextProps) {
  const base = typography[variant] as TextStyle;
  return (
    <Text
      style={[base, { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
