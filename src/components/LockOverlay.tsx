import { AppText, PrimaryButton, Screen } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { getBiometricCapability, promptUnlock } from '@/services/biometrics';
import { useApp } from '@/store/AppProvider';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, View } from 'react-native';

export function LockOverlay() {
  const { snapshot } = useApp();
  const theme = useTheme();
  const enabled = snapshot.settings.faceIdEnabled && snapshot.settings.adsRemoved;
  const [locked, setLocked] = useState(enabled);
  const [label, setLabel] = useState('Face ID');
  const appState = useRef(AppState.currentState);

  const lock = useCallback(() => {
    if (enabled) setLocked(true);
  }, [enabled]);

  const unlock = useCallback(async () => {
    const cap = await getBiometricCapability();
    setLabel(cap.label);
    const ok = await promptUnlock(cap.label);
    if (ok) setLocked(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLocked(false);
      return;
    }
    setLocked(true);
    void unlock();
  }, [enabled, unlock]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (appState.current.match(/active/) && next.match(/inactive|background/)) {
        lock();
      }
      if (appState.current.match(/background/) && next === 'active' && enabled) {
        void unlock();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [enabled, lock, unlock]);

  if (!enabled || !locked) return null;

  return (
    <View
      pointerEvents="auto"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        backgroundColor: theme.background,
      }}>
      <Screen style={{ alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
        <AppText type="title">訂閱助手已鎖定</AppText>
        <AppText type="body" color={theme.textSecondary} style={{ textAlign: 'center' }}>
          使用{label}解鎖後才能查看訂閱與支出。生物特徵不會離開這台裝置。
        </AppText>
        <PrimaryButton title={`以${label}解鎖`} onPress={() => void unlock()} />
      </Screen>
    </View>
  );
}
