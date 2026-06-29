import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Gentle, optional tactile feedback. No-ops on web. */
export const tap = {
  soft() {
    if (Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
  },
  light() {
    if (Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  kept() {
    if (Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
};
