import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, TextLink } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { ONBOARDING_PANELS } from '@/lib/content';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/theme/tokens';

const welcomeImage = require('../../assets/images/welcome-background.png');

export default function Onboarding() {
  const router = useRouter();
  const { completeOnboarding } = useStore();
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    fade.setValue(0);
    rise.setValue(12);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [index, fade, rise]);

  const last = index === ONBOARDING_PANELS.length - 1;
  const panel = ONBOARDING_PANELS[index];

  const finish = () => {
    completeOnboarding();
    router.replace('/');
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={welcomeImage} resizeMode="cover" style={StyleSheet.absoluteFill} />
      <View style={styles.lightWash} />
      <View style={styles.bottomWash} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <View style={styles.copyWrap}>
            <Animated.View style={[styles.copyPanel, { opacity: fade, transform: [{ translateY: rise }] }]}>
              <AppText variant="display" center style={styles.title}>
                {panel.title}
              </AppText>
              <AppText variant="serifBody" color={colors.textSecondary} center style={styles.body}>
                {panel.body}
              </AppText>
            </Animated.View>
          </View>

          <View style={styles.dots}>
            {ONBOARDING_PANELS.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          <View style={styles.actions}>
            <Button
              label={last ? 'Begin keeping' : 'Continue'}
              onPress={() => (last ? finish() : setIndex((i) => i + 1))}
              style={styles.primaryButton}
            />
            {!last ? <TextLink label="Skip" onPress={finish} /> : <View style={styles.spacer} />}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  lightWash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(251,247,239,0.22)',
  },
  bottomWash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(58,53,46,0.12)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  copyWrap: { flex: 1, justifyContent: 'flex-end', paddingBottom: spacing.xxl },
  copyPanel: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: 'rgba(251,247,239,0.64)',
  },
  title: {
    color: colors.textPrimary,
  },
  body: { marginTop: spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.surface, opacity: 0.65 },
  dotActive: { backgroundColor: colors.accent, opacity: 1, width: 22 },
  actions: { gap: spacing.sm, paddingBottom: spacing.lg },
  primaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(251,247,239,0.72)',
  },
  spacer: { height: 36 },
});
