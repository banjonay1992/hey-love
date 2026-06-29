import Svg, { Ellipse, G, Path } from 'react-native-svg';

import { palette } from '@/theme/tokens';

type BotanicalProps = {
  size?: number;
  color?: string;
  opacity?: number;
};

/** A small pressed-flower sprig. Quiet decoration, like something tucked in a book. */
export function Sprig({ size = 72, color = palette.sage, opacity = 0.9 }: BotanicalProps) {
  const leaf = (cx: number, cy: number, rot: number) => (
    <Ellipse cx={cx} cy={cy} rx={7} ry={3.4} fill={color} opacity={0.55} transform={`rotate(${rot} ${cx} ${cy})`} />
  );
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <G>
        <Path d="M50 92 C50 64 50 40 50 14" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
        {leaf(40, 70, 35)}
        {leaf(60, 60, -35)}
        {leaf(40, 50, 35)}
        {leaf(60, 40, -35)}
        {leaf(43, 30, 40)}
        <Ellipse cx={50} cy={14} rx={5} ry={6} fill={color} opacity={0.75} />
        <Ellipse cx={50} cy={12} rx={2.4} ry={3} fill={palette.cream} opacity={0.8} />
      </G>
    </Svg>
  );
}

/** A single fern-like frond, good for headers. */
export function Frond({ size = 120, color = palette.moss, opacity = 0.5 }: BotanicalProps) {
  const leaf = (x: number, y: number, rot: number, s = 1) => (
    <Ellipse cx={x} cy={y} rx={9 * s} ry={3 * s} fill={color} opacity={0.4} transform={`rotate(${rot} ${x} ${y})`} />
  );
  return (
    <Svg width={size} height={size * 0.5} viewBox="0 0 200 100" opacity={opacity}>
      <Path d="M8 80 C60 70 120 50 192 18" stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" />
      {leaf(40, 72, -20, 0.9)}
      {leaf(70, 64, -25)}
      {leaf(100, 54, -28)}
      {leaf(130, 44, -30)}
      {leaf(158, 32, -34, 0.9)}
      {leaf(178, 24, -38, 0.7)}
    </Svg>
  );
}

/** A seedling for empty, hopeful states. */
export function Seedling({ size = 96, color = palette.moss, opacity = 0.85 }: BotanicalProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Path d="M50 90 C50 70 50 56 50 42" stroke={color} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Path d="M50 56 C36 54 26 44 24 30 C40 30 50 40 50 56 Z" fill={color} opacity={0.4} />
      <Path d="M50 48 C64 46 74 36 76 22 C60 22 50 32 50 48 Z" fill={color} opacity={0.55} />
    </Svg>
  );
}
