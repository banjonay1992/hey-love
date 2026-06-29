import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

type FieldProps = TextInputProps & {
  label: string;
  multiline?: boolean;
};

export function Field({ label, multiline, style, ...rest }: FieldProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline, style]}
        {...rest}
      />
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}>
      <AppText variant="label" color={selected ? colors.surface : colors.textSecondary}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: { marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.textPrimary,
  },
  multiline: { minHeight: 110, textAlignVertical: 'top', lineHeight: 24 },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipPressed: { opacity: 0.7 },
});
