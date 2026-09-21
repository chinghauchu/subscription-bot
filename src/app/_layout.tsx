import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { LockOverlay } from '@/components/LockOverlay';
import { useResolvedScheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';
import { AppProvider, useApp } from '@/store/AppProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}

function RootNavigation() {
  const scheme = useResolvedScheme();
  const palette = Colors[scheme];
  const { ready, snapshot } = useApp();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const first = segments[0];
    const onOnboarding = first === 'onboarding';
    if (!snapshot.settings.onboardingDone && !onOnboarding) {
      router.replace('/onboarding');
      return;
    }
    if (snapshot.settings.onboardingDone && onOnboarding) {
      router.replace('/');
    }
  }, [ready, snapshot.settings.onboardingDone, segments, router]);

  const navTheme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: palette.background,
      card: palette.surface,
      text: palette.text,
      border: palette.border,
      primary: palette.accent,
    },
  };

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background }}>
        <ActivityIndicator color={palette.accent} />
      </View>
    );
  }

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShadowVisible: false, headerTintColor: palette.accent }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="subscription/new" options={{ title: '新增訂閱' }} />
        <Stack.Screen name="subscription/[id]" options={{ title: '編輯訂閱' }} />
        <Stack.Screen name="cleanup/[id]" options={{ title: '大掃除' }} />
        <Stack.Screen name="privacy" options={{ title: '隱私權政策' }} />
        <Stack.Screen name="terms" options={{ title: '使用條款' }} />
      </Stack>
      <LockOverlay />
    </ThemeProvider>
  );
}
