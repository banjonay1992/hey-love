import { type ReactNode } from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import Animated, {
  FadeIn as RNFadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { tap } from '@/lib/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** A slow, gentle rise-and-fade. Everything should arrive softly. */
export function Rise({
  children,
  delay = 0,
  distance = 14,
  style,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: ViewStyle;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(620).delay(delay).withInitialValues({
        transform: [{ translateY: distance }],
      })}
      style={style}>
      {children}
    </Animated.View>
  );
}

export function Fade({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: ViewStyle }) {
  return (
    <Animated.View entering={RNFadeIn.duration(700).delay(delay)} style={style}>
      {children}
    </Animated.View>
  );
}

/** Pressable that settles with a soft spring and an optional whisper of haptic. */
export function Press({
  children,
  onPress,
  style,
  haptic = 'soft',
  scaleTo = 0.97,
  disabled,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  haptic?: 'soft' | 'light' | 'none';
  scaleTo?: number;
  disabled?: boolean;
}) {
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * (1 - scaleTo), { damping: 18, stiffness: 220 }) }],
    opacity: withTiming(pressed.value ? 0.92 : 1, { duration: 120 }),
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      onPress={() => {
        if (haptic !== 'none') tap[haptic]();
        onPress?.();
      }}
      style={[style, animatedStyle]}>
      {children}
    </AnimatedPressable>
  );
}
