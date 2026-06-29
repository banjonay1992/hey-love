import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { Collection } from '@/lib/types';
import { colors, radius, softShadow, spacing } from '@/theme/tokens';

type Props = {
  collection: Collection;
  count: number;
  onPress?: () => void;
};

/** A labelled keepsake box, as if sitting on a wooden shelf. */
export function CollectionBox({ collection, count, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.box, pressed && styles.pressed]}>
      <View style={[styles.lid, { backgroundColor: collection.accent }]} />
      <View style={styles.label}>
        <AppText variant="serifBody" numberOfLines={2}>
          {collection.name}
        </AppText>
        <AppText variant="small" color={colors.textMuted}>
          {count === 0 ? 'Empty for now' : `${count} ${count === 1 ? 'memory' : 'memories'}`}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '48%',
    aspectRatio: 1.05,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...softShadow,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  lid: {
    height: 14,
    opacity: 0.85,
  },
  label: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'flex-end',
    gap: 4,
  },
});
