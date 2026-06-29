import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Seedling } from '@/components/Botanical';
import { CollectionBox } from '@/components/CollectionBox';
import { MemoryCard } from '@/components/MemoryCard';
import { TopBar } from '@/components/TopBar';
import { TextLink } from '@/components/ui/Button';
import { Rise } from '@/components/ui/Motion';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { isUnlocked, useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/theme/tokens';

export default function Keepsakes() {
  const router = useRouter();
  const { memories, collections } = useStore();

  const visible = memories.filter((m) => isUnlocked(m));
  const sealedCount = memories.length - visible.length;
  const countFor = (cid: string) => memories.filter((m) => m.collectionIds.includes(cid)).length;

  return (
    <Screen>
      <TopBar onBack={() => router.back()} backLabel="Home" right={<TextLink label="Settings" onPress={() => router.push('/settings')} />} />

      <AppText variant="display">Your keepsakes.</AppText>

      <Pressable
        onPress={() => router.push('/search')}
        style={({ pressed }) => [styles.search, pressed && styles.pressed]}>
        <AppText variant="body" color={colors.textMuted}>
          Search your memories…
        </AppText>
      </Pressable>

      {memories.length === 0 ? (
        <View style={styles.empty}>
          <Seedling size={104} />
          <AppText variant="serifBody" color={colors.textSecondary} center style={styles.emptyText}>
            Nothing kept yet — and that’s perfectly alright. When you’re ready, keep a little moment
            from your day.
          </AppText>
        </View>
      ) : (
        <>
          {collections.length > 0 && (
            <View style={styles.section}>
              <AppText variant="heading" style={styles.sectionTitle}>
                Keepsake boxes
              </AppText>
              <View style={styles.grid}>
                {collections.map((c) => (
                  <CollectionBox
                    key={c.id}
                    collection={c}
                    count={countFor(c.id)}
                    onPress={() => router.push({ pathname: '/collection/[id]', params: { id: c.id } })}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <AppText variant="heading" style={styles.sectionTitle}>
              Everything
            </AppText>
            {visible.map((m, i) => (
              <Rise key={m.id} delay={i * 60}>
                <MemoryCard
                  memory={m}
                  onPress={() => router.push({ pathname: '/memory/[id]', params: { id: m.id } })}
                />
              </Rise>
            ))}
            {sealedCount > 0 && (
              <View style={styles.sealedNote}>
                <AppText variant="small" color={colors.textMuted} center>
                  {sealedCount === 1
                    ? '1 memory is being kept for later.'
                    : `${sealedCount} memories are being kept for later.`}
                </AppText>
              </View>
            )}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  pressed: { opacity: 0.8 },
  empty: { paddingVertical: spacing.huge, paddingHorizontal: spacing.lg, alignItems: 'center', gap: spacing.lg },
  emptyText: { maxWidth: 320 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sealedNote: { paddingVertical: spacing.lg },
});
