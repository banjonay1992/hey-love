import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { palette } from '@/theme/tokens';

/**
 * A warm, aged-paper canvas. A soft vertical wash with a gentle glow near the
 * top, like morning light falling on cream card stock.
 */
export function PaperBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[palette.paper, palette.cream, palette.oat]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="14%" rx="80%" ry="44%">
            <Stop offset="0%" stopColor="#FFFDF8" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#FFFDF8" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
      </Svg>
    </View>
  );
}
