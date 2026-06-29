import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/TopBar';
import { Waveform } from '@/components/Waveform';
import { TextLink } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { formatDuration, formatDate } from '@/lib/format';
import { isUnlocked, useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/theme/tokens';

export default function MemoryDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMemory, getCollection, deleteMemory } = useStore();
  const memory = getMemory(id);

  const player = useAudioPlayer(memory?.audioUri ?? null);
  const status = useAudioPlayerStatus(player);

  if (!memory) {
    return (
      <Screen>
        <TopBar onBack={() => router.back()} />
        <AppText variant="serifBody" color={colors.textSecondary}>
          This memory could not be found.
        </AppText>
      </Screen>
    );
  }

  const locked = !isUnlocked(memory);
  const title = memory.title?.trim() || 'A memory to keep';
  const duration = status.duration || (memory.durationMillis ?? 0) / 1000;
  const progress = duration > 0 ? status.currentTime / duration : 0;

  const togglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (progress >= 0.999) player.seekTo(0);
      player.play();
    }
  };

  const onShare = async () => {
    const uri = memory.audioUri || memory.photoUri;
    if (!uri) return;
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing unavailable', 'Sharing isn’t available on this device.');
      return;
    }
    await Sharing.shareAsync(uri);
  };

  const onDelete = () => {
    Alert.alert('Let this go?', 'This memory will be removed from your keepsakes.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Let it go',
        style: 'destructive',
        onPress: () => {
          deleteMemory(memory.id);
          router.back();
        },
      },
    ]);
  };

  if (locked) {
    return (
      <Screen>
        <TopBar onBack={() => router.back()} />
        <View style={styles.lockedWrap}>
          <View style={styles.seal} />
          <AppText variant="title" center>
            Not yet, Love.
          </AppText>
          <AppText variant="serifBody" color={colors.textSecondary} center style={styles.lockedText}>
            This memory is being kept for {formatDate(memory.unlockDate!)}. It will be here, waiting,
            when the day arrives.
          </AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar onBack={() => router.back()} right={<TextLink label="Share" onPress={onShare} />} />

      {memory.photoUri && (
        <Image source={{ uri: memory.photoUri }} style={styles.photo} contentFit="cover" transition={300} />
      )}

      <View style={styles.head}>
        {memory.about ? (
          <AppText variant="tiny" color={colors.textMuted}>
            {memory.about.toUpperCase()}
          </AppText>
        ) : null}
        <AppText variant="display">{title}</AppText>
        <AppText variant="small" color={colors.textMuted} style={styles.date}>
          {formatDate(memory.createdAt)}
        </AppText>
      </View>

      {memory.audioUri ? (
        <View style={styles.player}>
          <Pressable onPress={togglePlay} style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]}>
            {status.playing ? (
              <View style={styles.pauseIcon}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            ) : (
              <View style={styles.playTriangle} />
            )}
          </Pressable>
          <View style={styles.playerBody}>
            <Waveform count={40} height={44} color={colors.accent} progress={progress} seed={title.length + 5} />
            <View style={styles.playerMeta}>
              <AppText variant="small" color={colors.textMuted}>
                {formatDuration(status.currentTime * 1000)}
              </AppText>
              <AppText variant="small" color={colors.textMuted}>
                {formatDuration((memory.durationMillis ?? duration * 1000) || 0)}
              </AppText>
            </View>
          </View>
        </View>
      ) : null}

      {memory.note ? (
        <View style={styles.noteCard}>
          <AppText variant="serifBody" style={styles.note}>
            {memory.note}
          </AppText>
        </View>
      ) : null}

      {memory.prompt ? (
        <AppText variant="small" color={colors.textMuted} style={styles.prompt}>
          In response to: {memory.prompt}
        </AppText>
      ) : null}

      {memory.collectionIds.length > 0 ? (
        <View style={styles.tags}>
          {memory.collectionIds.map((cid) => {
            const c = getCollection(cid);
            if (!c) return null;
            return (
              <View key={cid} style={styles.tag}>
                <View style={[styles.tagDot, { backgroundColor: c.accent }]} />
                <AppText variant="small" color={colors.textSecondary}>
                  {c.name}
                </AppText>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.footer}>
        <TextLink label="Let this memory go" onPress={onDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', height: 280, borderRadius: radius.lg, marginBottom: spacing.lg },
  head: { marginBottom: spacing.xl, gap: 4 },
  date: { marginTop: 4 },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  playTriangle: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 20,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.surface,
  },
  pauseIcon: { flexDirection: 'row', gap: 6 },
  pauseBar: { width: 6, height: 24, borderRadius: 3, backgroundColor: colors.surface },
  playerBody: { flex: 1, gap: spacing.sm },
  playerMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  noteCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  note: { lineHeight: 30 },
  prompt: { marginTop: spacing.lg, fontStyle: 'italic' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSunken,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  tagDot: { width: 8, height: 8, borderRadius: 4 },
  footer: { marginTop: spacing.xxl, alignItems: 'center' },
  lockedWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  seal: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  lockedText: { marginTop: spacing.sm, maxWidth: 320 },
});
