import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Waveform } from '@/components/Waveform';
import { formatDuration, gentleWhen } from '@/lib/format';
import { isUnlocked } from '@/lib/store';
import type { Memory } from '@/lib/types';
import { colors, radius, softShadow, spacing } from '@/theme/tokens';

const TYPE_LABEL: Record<Memory['type'], string> = {
  voice: 'Voice',
  sound: 'Sound',
  photo: 'Photograph',
  note: 'Words',
};

export function MemoryCard({ memory, onPress }: { memory: Memory; onPress?: () => void }) {
  const locked = !isUnlocked(memory);
  const title = memory.title?.trim() || defaultTitle(memory);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {locked ? (
        <SealedFace memory={memory} />
      ) : (
        <>
          <View style={styles.media}>
            {memory.photoUri ? (
              <Image source={{ uri: memory.photoUri }} style={styles.thumb} contentFit="cover" transition={250} />
            ) : memory.type === 'note' ? (
              <View style={[styles.thumb, styles.noteThumb]}>
                <AppText variant="title" color={colors.accent}>
                  ”
                </AppText>
              </View>
            ) : (
              <View style={[styles.thumb, styles.audioThumb]}>
                <Waveform count={12} height={28} color={colors.accent} seed={title.length + 3} />
              </View>
            )}
          </View>
          <View style={styles.body}>
            <AppText variant="tiny" color={colors.textMuted} style={styles.kicker}>
              {TYPE_LABEL[memory.type].toUpperCase()}
              {memory.about ? `  ·  ${memory.about.toUpperCase()}` : ''}
            </AppText>
            <AppText variant="heading" numberOfLines={1}>
              {title}
            </AppText>
            <View style={styles.meta}>
              <AppText variant="small" color={colors.textMuted}>
                {gentleWhen(memory.createdAt)}
              </AppText>
              {memory.audioUri && memory.durationMillis ? (
                <AppText variant="small" color={colors.textMuted}>
                  {`  ·  ${formatDuration(memory.durationMillis)}`}
                </AppText>
              ) : null}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

function SealedFace({ memory }: { memory: Memory }) {
  return (
    <View style={styles.sealed}>
      <View style={styles.wax} />
      <View style={styles.body}>
        <AppText variant="tiny" color={colors.textMuted} style={styles.kicker}>
          KEPT FOR LATER
        </AppText>
        <AppText variant="heading">A memory is waiting</AppText>
        <AppText variant="small" color={colors.textMuted}>
          Opens {gentleWhen(memory.unlockDate ?? memory.createdAt)}
        </AppText>
      </View>
    </View>
  );
}

function defaultTitle(memory: Memory) {
  if (memory.note) return memory.note.split('\n')[0].slice(0, 48);
  switch (memory.type) {
    case 'photo':
      return 'A photograph';
    case 'note':
      return 'A few words';
    case 'sound':
      return 'A sound to keep';
    default:
      return 'A voice to keep';
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...softShadow,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  media: { marginRight: spacing.md },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  noteThumb: { backgroundColor: colors.surfaceSunken },
  audioThumb: { paddingHorizontal: spacing.sm },
  body: { flex: 1 },
  kicker: { marginBottom: 2 },
  meta: { flexDirection: 'row', marginTop: 2 },
  sealed: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  wax: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    marginRight: spacing.md,
    opacity: 0.85,
  },
});
