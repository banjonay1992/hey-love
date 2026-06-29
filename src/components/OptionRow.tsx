import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Press } from '@/components/ui/Motion';
import { colors, radius, spacing } from '@/theme/tokens';

type Props = {
  label: string;
  hint: string;
  onPress?: () => void;
};

/** A single, unhurried choice on the home screen. */
export function OptionRow({ label, hint, onPress }: Props) {
  return (
    <Press onPress={onPress} style={styles.row} scaleTo={0.985}>
      <View style={styles.ring} />
      <View style={styles.text}>
        <AppText variant="serifBody">{label}</AppText>
        <AppText variant="small" color={colors.textMuted}>
          {hint}
        </AppText>
      </View>
    </Press>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  pressed: { opacity: 0.6 },
  ring: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    marginRight: spacing.lg,
  },
  text: { flex: 1, gap: 1 },
});
