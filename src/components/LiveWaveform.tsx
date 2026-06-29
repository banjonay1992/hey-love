import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius } from '@/theme/tokens';

function Bar({ value, color, height }: { value: number; color: string; height: number }) {
  const h = useSharedValue(value);
  useEffect(() => {
    h.value = withTiming(value, { duration: 140 });
  }, [value, h]);

  const style = useAnimatedStyle(() => ({
    height: Math.max(4, h.value * height),
  }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          marginHorizontal: 1.5,
          borderRadius: radius.pill,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/**
 * A waveform that breathes with sound. `values` is a rolling list of recent
 * levels (0..1); the newest is on the right, so the wave flows as you speak.
 */
export function LiveWaveform({
  values,
  color = colors.accent,
  height = 64,
}: {
  values: number[];
  color?: string;
  height?: number;
}) {
  return (
    <View style={[styles.row, { height }]}>
      {values.map((v, i) => (
        <Bar key={i} value={v} color={color} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
