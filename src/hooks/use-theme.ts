import { Colors, type ThemeName } from '@/constants/theme';
import { useApp } from '@/store/AppProvider';
import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';

export function useResolvedScheme(): ThemeName {
  const system = useSystemColorScheme();
  try {
    const { snapshot } = useApp();
    if (snapshot.settings.theme === 'light' || snapshot.settings.theme === 'dark') {
      return snapshot.settings.theme;
    }
  } catch {
    // Root providers may render before AppProvider in tests.
  }
  return system === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  return Colors[useResolvedScheme()];
}
