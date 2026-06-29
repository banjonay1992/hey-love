import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme/tokens';

type WaveformProps = {
  /** Number of bars. */
  count?: number;
  /** Bar colour. */
  color?: string;
  height?: number;
  /** 0..1 progress — bars before this are full opacity. */
  progress?: number;
  seed?: number;
};

/** A calm, hand-drawn looking set of bars. Decorative, not a live meter. */
export function Waveform({
  count = 28,
  color = colors.accent,
  height = 40,
  progress = 1,
  seed = 7,
}: WaveformProps) {
  const bars = Array.from({ length: count }, (_, i) => {
    // Deterministic, gentle pseudo-random heights.
    const n = Math.sin((i + 1) * seed * 0.7) * 0.5 + 0.5;
    const eased = 0.28 + n * 0.72;
    return eased;
  });

  return (
    <View style={[styles.row, { height }]}>
      {bars.map((h, i) => {
        const active = i / count <= progress;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              marginHorizontal: 1.5,
              height: Math.max(4, h * height),
              borderRadius: radius.pill,
              backgroundColor: color,
              opacity: active ? 0.9 : 0.22,
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
