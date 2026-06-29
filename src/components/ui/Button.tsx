import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

type Variant = 'primary' | 'quiet' | 'ghost';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'quiet' && styles.quiet,
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <AppText
        variant="bodyMedium"
        color={variant === 'primary' ? colors.surface : colors.textPrimary}
        center>
        {label}
      </AppText>
    </Pressable>
  );
}

/** A quiet text link for "not now" style choices. */
export function TextLink({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => pressed && styles.pressed}>
      <View style={styles.link}>
        <AppText variant="label" color={colors.textMuted} center>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.accent,
  },
  quiet: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
  link: { paddingVertical: spacing.sm },
});
