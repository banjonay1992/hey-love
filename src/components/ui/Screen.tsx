import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { PaperBackground } from '@/components/PaperBackground';
import { spacing } from '@/theme/tokens';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  edges?: Edge[];
  /** Hide the paper canvas (e.g. for full-bleed media). */
  plain?: boolean;
};

/**
 * A calm, breathing canvas. Generous horizontal padding, max width so
 * nothing ever feels crowded.
 */
export function Screen({
  children,
  scroll = true,
  contentStyle,
  edges = ['top', 'bottom'],
  plain = false,
}: ScreenProps) {
  const inner = (
    <View style={[styles.inner, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.fill}>
      {!plain && <PaperBackground />}
      <SafeAreaView style={styles.safe} edges={edges}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {inner}
          </ScrollView>
        ) : (
          <View style={styles.fill}>{inner}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
  },
});
