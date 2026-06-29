import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, spacing } from '@/theme/tokens';

type TopBarProps = {
  title?: string;
  onBack?: () => void;
  backLabel?: string;
  right?: React.ReactNode;
};

export function TopBar({ title, onBack, backLabel = 'Back', right }: TopBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={14} style={({ pressed }) => pressed && styles.pressed}>
            <AppText variant="label" color={colors.textMuted}>
              {`‹  ${backLabel}`}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {title ? (
        <AppText variant="label" color={colors.textSecondary} center style={styles.title}>
          {title}
        </AppText>
      ) : (
        <View style={styles.title} />
      )}
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    marginBottom: spacing.sm,
  },
  side: { width: 84, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  title: { flex: 1 },
  pressed: { opacity: 0.6 },
});
