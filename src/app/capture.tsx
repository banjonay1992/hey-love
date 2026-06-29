import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { LiveWaveform } from '@/components/LiveWaveform';
import { Seedling, Sprig } from '@/components/Botanical';
import { TopBar } from '@/components/TopBar';
import { Waveform } from '@/components/Waveform';
import { Button, TextLink } from '@/components/ui/Button';
import { Chip, Field } from '@/components/ui/Field';
import { Rise } from '@/components/ui/Motion';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { CAPSULE_OPTIONS } from '@/lib/capsule';
import { CaptureKind, HOME_OPTIONS, promptFor, random, TODAYS_SOUNDS } from '@/lib/content';
import { formatDuration } from '@/lib/format';
import { tap } from '@/lib/haptics';
import { useStore } from '@/lib/store';
import { useLevels } from '@/lib/useLevels';
import { useRecorder } from '@/lib/useRecorder';
import type { MemoryType } from '@/lib/types';
import { colors, radius, spacing } from '@/theme/tokens';

type Stage = 'capture' | 'details' | 'done';

export default function Capture() {
  const router = useRouter();
  const { kind = 'voice', sound } = useLocalSearchParams<{ kind: CaptureKind; sound?: string }>();
  const isSound = sound === '1';
  const option = HOME_OPTIONS.find((o) => o.kind === kind) ?? HOME_OPTIONS[0];
  const baseType: MemoryType = isSound ? 'sound' : option.baseType;

  const { addMemory, collections, addCollection } = useStore();

  const [stage, setStage] = useState<Stage>('capture');
  const [audioUri, setAudioUri] = useState<string | undefined>();
  const [durationMillis, setDurationMillis] = useState(0);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [noteText, setNoteText] = useState('');

  // Details
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [words, setWords] = useState('');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [newCollection, setNewCollection] = useState('');
  const [capsuleKey, setCapsuleKey] = useState(kind === 'later' ? 'oneYear' : 'none');

  const prompt = useMemo(
    () => (isSound ? random(TODAYS_SOUNDS) : promptFor(kind)),
    [kind, isSound],
  );

  const toggleCollection = (id: string) =>
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const handleSave = () => {
    const ids = [...selectedCollections];
    if (newCollection.trim()) ids.push(addCollection(newCollection).id);
    const capsule = CAPSULE_OPTIONS.find((c) => c.key === capsuleKey)?.date() ?? null;

    addMemory({
      type: baseType,
      title: title.trim() || undefined,
      about: about.trim() || undefined,
      note: (baseType === 'note' ? noteText : words).trim() || undefined,
      prompt,
      audioUri,
      durationMillis: audioUri ? durationMillis : undefined,
      photoUri,
      collectionIds: ids,
      unlockDate: capsule ? capsule.toISOString() : undefined,
    });
    tap.kept();
    setStage('done');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen contentStyle={styles.content} scroll={stage !== 'capture' || baseType === 'note'}>
        <TopBar
          backLabel="Close"
          onBack={() => (stage === 'details' ? setStage('capture') : router.back())}
        />

        {stage === 'capture' && (
          <CaptureStage
            baseType={baseType}
            isSound={isSound}
            prompt={prompt}
            noteText={noteText}
            setNoteText={setNoteText}
            photoUri={photoUri}
            onPhoto={setPhotoUri}
            onAudio={(uri, ms) => {
              setAudioUri(uri);
              setDurationMillis(ms);
            }}
            onContinue={() => setStage('details')}
          />
        )}

        {stage === 'details' && (
          <View style={styles.flex}>
            <AppText variant="title">A few gentle questions.</AppText>
            <AppText variant="small" color={colors.textMuted} style={styles.subtle}>
              Nothing here is required. Keep only what you’d like.
            </AppText>

            <View style={styles.form}>
              <Field
                label="Would you like to give this a name?"
                placeholder="Sunday morning"
                value={title}
                onChangeText={setTitle}
              />
              <Field
                label="Who is this about?"
                placeholder="Belle, Mum, our garden…"
                value={about}
                onChangeText={setAbout}
              />
              {baseType !== 'note' && (
                <Field
                  label="Would you like to write a few words?"
                  placeholder="What you’d like to remember…"
                  value={words}
                  onChangeText={setWords}
                  multiline
                />
              )}

              {baseType !== 'photo' && (
                <View style={styles.block}>
                  <AppText variant="label" color={colors.textSecondary} style={styles.blockLabel}>
                    Would you like to add a photo?
                  </AppText>
                  <PhotoPicker photoUri={photoUri} onPhoto={setPhotoUri} />
                </View>
              )}

              <View style={styles.block}>
                <AppText variant="label" color={colors.textSecondary} style={styles.blockLabel}>
                  Keep it in a collection
                </AppText>
                <View style={styles.chips}>
                  {collections.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      selected={selectedCollections.includes(c.id)}
                      onPress={() => toggleCollection(c.id)}
                    />
                  ))}
                </View>
                <Field
                  label=""
                  placeholder="Or name a new keepsake box…"
                  value={newCollection}
                  onChangeText={setNewCollection}
                />
              </View>

              <View style={styles.block}>
                <AppText variant="label" color={colors.textSecondary} style={styles.blockLabel}>
                  When should this be opened?
                </AppText>
                <View style={styles.chips}>
                  {CAPSULE_OPTIONS.map((c) => (
                    <Chip
                      key={c.key}
                      label={c.label}
                      selected={capsuleKey === c.key}
                      onPress={() => setCapsuleKey(c.key)}
                    />
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.actions}>
              <Button label="Keep this safely" onPress={handleSave} />
            </View>
          </View>
        )}

        {stage === 'done' && (
          <DoneStage
            onDone={() => router.back()}
            onAnother={() => router.replace('/')}
          />
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

/* ---------- Capture stage ---------- */

function CaptureStage(props: {
  baseType: MemoryType;
  isSound: boolean;
  prompt: string;
  noteText: string;
  setNoteText: (t: string) => void;
  photoUri?: string;
  onPhoto: (uri: string) => void;
  onAudio: (uri: string, ms: number) => void;
  onContinue: () => void;
}) {
  const { baseType, isSound, prompt, noteText, setNoteText, photoUri, onPhoto, onAudio, onContinue } =
    props;

  if (baseType === 'note') {
    return (
      <View style={styles.flex}>
        <AppText variant="title">A thought to keep.</AppText>
        <AppText variant="serifBody" color={colors.textSecondary} style={styles.promptText}>
          {prompt}
        </AppText>
        <Field
          label=""
          placeholder="Write freely…"
          value={noteText}
          onChangeText={setNoteText}
          multiline
          autoFocus
          style={styles.bigNote}
        />
        <View style={styles.actions}>
          <Button label="Continue" onPress={onContinue} disabled={!noteText.trim()} />
        </View>
      </View>
    );
  }

  if (baseType === 'photo') {
    return (
      <View style={styles.flex}>
        <AppText variant="title">A photograph.</AppText>
        <AppText variant="serifBody" color={colors.textSecondary} style={styles.promptText}>
          {prompt}
        </AppText>
        <View style={styles.photoStage}>
          <PhotoPicker photoUri={photoUri} onPhoto={onPhoto} large />
        </View>
        <View style={styles.actions}>
          <Button label="Continue" onPress={onContinue} disabled={!photoUri} />
        </View>
      </View>
    );
  }

  return (
    <Recorder isSound={isSound} prompt={prompt} onAudio={onAudio} onContinue={onContinue} />
  );
}

/* ---------- Recorder ---------- */

function Recorder({
  isSound,
  prompt,
  onAudio,
  onContinue,
}: {
  isSound: boolean;
  prompt: string;
  onAudio: (uri: string, ms: number) => void;
  onContinue: () => void;
}) {
  const { permission, isRecording, durationMillis, metering, start, stop } = useRecorder();
  const [savedUri, setSavedUri] = useState<string | undefined>();
  const [savedMs, setSavedMs] = useState(0);
  const levels = useLevels(isRecording, metering);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      );
      anim.start();
      return () => anim.stop();
    }
    pulse.setValue(0);
  }, [isRecording, pulse]);

  const handleStart = async () => {
    tap.light();
    await start();
  };

  const handleStop = async () => {
    tap.soft();
    const { uri, durationMillis: ms } = await stop();
    if (uri) {
      setSavedUri(uri);
      setSavedMs(ms);
      onAudio(uri, ms);
    }
  };

  if (permission === false) {
    return (
      <View style={[styles.flex, styles.permission]}>
        <Seedling size={96} />
        <AppText variant="title" center>May we listen?</AppText>
        <AppText variant="serifBody" color={colors.textSecondary} center style={styles.promptText}>
          Hey, Love needs permission to use your microphone to keep a voice. You can allow it in
          Settings whenever you’re ready.
        </AppText>
      </View>
    );
  }

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0] });

  return (
    <View style={styles.flex}>
      <AppText variant="title">{isSound ? 'Today’s sound.' : 'Press once. That’s all.'}</AppText>
      <AppText variant="serifBody" color={colors.textSecondary} style={styles.promptText}>
        {isSound ? `Just record the world around you.\n${prompt}` : prompt}
      </AppText>

      <View style={styles.recorderCenter}>
        {savedUri ? (
          <Waveform count={34} height={64} color={colors.accent} seed={Math.round(savedMs / 100)} />
        ) : (
          <LiveWaveform
            values={levels}
            height={64}
            color={isRecording ? colors.accent : colors.borderStrong}
          />
        )}

        <AppText variant="heading" color={colors.textSecondary} style={styles.timer}>
          {formatDuration(savedUri ? savedMs : durationMillis)}
        </AppText>

        {!savedUri ? (
          <Pressable onPress={isRecording ? handleStop : handleStart} style={styles.recordWrap}>
            <Animated.View style={[styles.recordRing, { opacity: ringOpacity, transform: [{ scale }] }]} />
            <View style={[styles.recordButton, isRecording && styles.recordButtonActive]}>
              {isRecording ? <View style={styles.stopSquare} /> : <View style={styles.recordDot} />}
            </View>
          </Pressable>
        ) : (
          <View style={styles.savedActions}>
            <Button label="Keep this" onPress={onContinue} />
            <TextLink
              label="Record again"
              onPress={() => {
                setSavedUri(undefined);
                setSavedMs(0);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

/* ---------- Photo picker ---------- */

function PhotoPicker({
  photoUri,
  onPhoto,
  large,
}: {
  photoUri?: string;
  onPhoto: (uri: string) => void;
  large?: boolean;
}) {
  const pick = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to add a photograph.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) onPhoto(result.assets[0].uri);
  };

  return (
    <Pressable onPress={pick} style={({ pressed }) => [pressed && { opacity: 0.85 }]}>
      <View style={[styles.photoBox, large && styles.photoBoxLarge]}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        ) : (
          <AppText variant="label" color={colors.textMuted}>
            {large ? 'Choose a photograph' : 'Add a photo'}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

/* ---------- Done ---------- */

function DoneStage({ onDone, onAnother }: { onDone: () => void; onAnother: () => void }) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [fade]);

  return (
    <Animated.View style={[styles.doneWrap, { opacity: fade }]}>
      <Rise>
        <View style={styles.sprig}>
          <Sprig size={84} />
        </View>
      </Rise>
      <AppText variant="title" center>
        Kept safely.
      </AppText>
      <AppText variant="serifBody" color={colors.textSecondary} center style={styles.doneText}>
        It’s yours now, and it isn’t going anywhere. Close the app, and go make another.
      </AppText>
      <View style={styles.doneActions}>
        <Button label="Done" onPress={onDone} />
        <TextLink label="Keep another" onPress={onAnother} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: spacing.xxl },
  subtle: { marginTop: spacing.sm },
  promptText: { marginTop: spacing.md, marginBottom: spacing.lg },
  form: { marginTop: spacing.xl },
  block: { marginBottom: spacing.lg },
  blockLabel: { marginBottom: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  actions: { marginTop: 'auto', paddingTop: spacing.xl },
  bigNote: { minHeight: 200, flex: 1 },

  permission: { alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  sprig: { alignItems: 'center', marginBottom: spacing.sm },
  recorderCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  timer: { fontVariant: ['tabular-nums'] },
  recordWrap: { alignItems: 'center', justifyContent: 'center', width: 120, height: 120 },
  recordRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: colors.recording,
  },
  recordButton: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.recording,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonActive: { backgroundColor: colors.recording },
  recordDot: { width: 34, height: 34, borderRadius: radius.pill, backgroundColor: colors.recording },
  stopSquare: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.surface },
  savedActions: { alignSelf: 'stretch', gap: spacing.sm },

  photoStage: { flex: 1, justifyContent: 'center' },
  photoBox: {
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoBoxLarge: { height: 320 },

  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  seal: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  doneText: { marginTop: spacing.sm, maxWidth: 320 },
  doneActions: { marginTop: spacing.xxl, alignSelf: 'stretch', gap: spacing.sm },
});
