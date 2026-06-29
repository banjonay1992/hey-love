import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Wraps expo-audio into a gentle, one-tap recording experience.
 * Recordings are stored in the document directory so they persist.
 */
export function useRecorder() {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
    directory: 'document',
  });
  const state = useAudioRecorderState(recorder, 100);
  const [permission, setPermission] = useState<boolean | null>(null);
  const lastDuration = useRef(0);

  useEffect(() => {
    if (state.isRecording && state.durationMillis) {
      lastDuration.current = state.durationMillis;
    }
  }, [state.isRecording, state.durationMillis]);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setPermission(status.granted);
      try {
        await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      } catch {
        // best effort
      }
    })();
  }, []);

  const start = useCallback(async () => {
    await recorder.prepareToRecordAsync();
    recorder.record();
  }, [recorder]);

  const stop = useCallback(async () => {
    const duration = Math.max(lastDuration.current, state.durationMillis ?? 0);
    await recorder.stop();
    lastDuration.current = 0;
    return { uri: recorder.uri, durationMillis: duration };
  }, [recorder, state.durationMillis]);

  return {
    permission,
    isRecording: state.isRecording,
    durationMillis: state.durationMillis ?? 0,
    metering: state.metering,
    start,
    stop,
    uri: recorder.uri,
  };
}
