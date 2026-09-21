import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#14221F',
    textSecondary: '#5C6B67',
    background: '#F3EFE6',
    surface: '#FFFCF6',
    surfaceAlt: '#E7EFEA',
    border: '#D7E0DB',
    accent: '#0F6E62',
    accentSoft: '#D7EDE8',
    gold: '#A57C1B',
    danger: '#B42318',
    warning: '#B45309',
    tabBar: '#FFFCF6',
    overlay: 'rgba(15, 34, 31, 0.52)',
    adSlot: '#E4E8E2',
  },
  dark: {
    text: '#F4F7F4',
    textSecondary: '#A8B6B1',
    background: '#071615',
    surface: '#12201E',
    surfaceAlt: '#18302C',
    border: '#2A3F3B',
    accent: '#3DCFB8',
    accentSoft: '#16443E',
    gold: '#E0B84A',
    danger: '#F97066',
    warning: '#F6B445',
    tabBar: '#0C1A18',
    overlay: 'rgba(4, 10, 9, 0.72)',
    adSlot: '#1A2A27',
  },
} as const;

export type ThemeName = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'sans-serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    rounded: 'ui-rounded, system-ui, sans-serif',
    mono: 'ui-monospace, monospace',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
} as const;
