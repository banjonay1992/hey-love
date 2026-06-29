import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Frond } from '@/components/Botanical';
import { OptionRow } from '@/components/OptionRow';
import { Press, Rise } from '@/components/ui/Motion';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { greeting, HOME_OPTIONS, random, TODAYS_SOUNDS } from '@/lib/content';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { ready, onboarded, memories } = useStore();

  if (!ready) return <Screen scroll={false}><View /></Screen>;
  if (!onboarded) return <Redirect href="/onboarding" />;

  const sound = random(TODAYS_SOUNDS);

  return (
    <Screen contentStyle={styles.content}>
      <Rise style={styles.header}>
        <View style={styles.frond}>
          <Frond size={140} />
        </View>
        <AppText variant="display">{greeting()}</AppText>
        <AppText variant="serifBody" color={colors.textSecondary} style={styles.sub}>
          What would you like to keep today?
        </AppText>
      </Rise>

      <View style={styles.options}>
        {HOME_OPTIONS.map((o, i) => (
          <Rise key={o.kind} delay={120 + i * 70}>
            <OptionRow
              label={o.label}
              hint={o.hint}
              onPress={() => router.push({ pathname: '/capture', params: { kind: o.kind } })}
            />
          </Rise>
        ))}
      </View>

      <Rise delay={120 + HOME_OPTIONS.length * 70}>
        <Press
          onPress={() => router.push({ pathname: '/capture', params: { kind: 'moment', sound: '1' } })}
          style={styles.soundCard}>
          <AppText variant="tiny" color={colors.leaf}>
            TODAY'S SOUND
          </AppText>
          <AppText variant="serifBody" style={styles.soundText}>
            Don't say anything. Just record the world around you for thirty seconds.
          </AppText>
          <AppText variant="small" color={colors.textMuted}>
            {sound}
          </AppText>
        </Press>
      </Rise>

      <View style={styles.footer}>
        <Press onPress={() => router.push('/keepsakes')} haptic="none">
          <AppText variant="label" color={colors.textSecondary}>
            {memories.length > 0 ? '<  Open your keepsakes' : '<  Your keepsakes'}
          </AppText>
        </Press>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xl },
  header: { marginTop: spacing.lg, marginBottom: spacing.lg },
  frond: { marginLeft: -spacing.sm, marginBottom: spacing.sm, opacity: 0.9 },
  sub: { marginTop: spacing.sm },
  options: { marginTop: spacing.sm },
  soundCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  soundText: { marginVertical: 2 },
  pressed: { opacity: 0.85 },
  footer: { marginTop: 'auto', paddingTop: spacing.xxl, paddingBottom: spacing.lg, alignItems: 'center' },
});
