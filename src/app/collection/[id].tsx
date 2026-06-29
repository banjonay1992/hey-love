import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MemoryCard } from '@/components/MemoryCard';
import { TopBar } from '@/components/TopBar';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { isUnlocked, useStore } from '@/lib/store';
import { colors, spacing } from '@/theme/tokens';

export default function CollectionDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCollection, memories } = useStore();
  const collection = getCollection(id);

  const items = memories.filter((m) => m.collectionIds.includes(id) && isUnlocked(m));

  return (
    <Screen>
      <TopBar onBack={() => router.back()} backLabel="Keepsakes" />
      <View style={styles.head}>
        <View style={[styles.lid, { backgroundColor: collection?.accent ?? colors.accent }]} />
        <AppText variant="display">{collection?.name ?? 'A keepsake box'}</AppText>
        <AppText variant="small" color={colors.textMuted}>
          {items.length === 0 ? 'Nothing kept here yet' : `${items.length} ${items.length === 1 ? 'memory' : 'memories'}`}
        </AppText>
      </View>

      {items.length === 0 ? (
        <AppText variant="serifBody" color={colors.textSecondary} style={styles.empty}>
          When you keep a memory, add it to this box and it will gather here.
        </AppText>
      ) : (
        items.map((m) => (
          <MemoryCard
            key={m.id}
            memory={m}
            onPress={() => router.push({ pathname: '/memory/[id]', params: { id: m.id } })}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { marginBottom: spacing.xl, gap: 6 },
  lid: { width: 56, height: 10, borderRadius: 6, marginBottom: spacing.sm, opacity: 0.85 },
  empty: { marginTop: spacing.lg },
});
