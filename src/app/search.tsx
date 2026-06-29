import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { MemoryCard } from '@/components/MemoryCard';
import { TopBar } from '@/components/TopBar';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { isUnlocked, useStore } from '@/lib/store';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

export default function Search() {
  const router = useRouter();
  const { memories, collections } = useStore();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return memories.filter((m) => {
      if (!isUnlocked(m)) return false;
      const collectionNames = m.collectionIds
        .map((id) => collections.find((c) => c.id === id)?.name ?? '')
        .join(' ');
      const haystack = [
        m.title,
        m.about,
        m.note,
        m.prompt,
        m.type,
        new Date(m.createdAt).getFullYear().toString(),
        new Date(m.createdAt).toLocaleDateString(undefined, { month: 'long' }),
        collectionNames,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, memories, collections]);

  return (
    <Screen>
      <TopBar onBack={() => router.back()} backLabel="Keepsakes" />
      <AppText variant="title">Find a memory.</AppText>

      <View style={styles.searchBox}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder="Belle, rain, kitchen, 2026…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>

      {query.trim().length === 0 ? (
        <AppText variant="small" color={colors.textMuted} style={styles.hint}>
          Search by a name, a place, a feeling, or a year.
        </AppText>
      ) : results.length === 0 ? (
        <AppText variant="serifBody" color={colors.textSecondary} style={styles.hint}>
          Nothing found for “{query.trim()}”. The voice is still safe — try another word.
        </AppText>
      ) : (
        results.map((m) => (
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
  searchBox: { marginTop: spacing.lg, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.textPrimary,
  },
  hint: { marginTop: spacing.md },
});
