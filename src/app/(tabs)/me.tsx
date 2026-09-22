import { AppText, Card, Chip, GhostButton, PrimaryButton, Screen } from '@/components/ui';
import { SyncStatusBanner } from '@/components/SyncStatusBanner';
import { useTheme } from '@/hooks/use-theme';
import { snapshotToJson, subscriptionsToCsv, shareTextFile } from '@/services/export';
import { getBiometricCapability } from '@/services/biometrics';
import { PRIVACY_URL, TERMS_URL } from '@/constants/legal';
import { iapFootnote, purchaseRemoveAds, REMOVE_ADS_PRICE_LABEL, restoreRemoveAds } from '@/services/iap';
import { useApp } from '@/store/AppProvider';
import type { ThemePreference } from '@/store/types';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEMES: { id: ThemePreference; label: string }[] = [
  { id: 'system', label: '系統' },
  { id: 'light', label: '淺色' },
  { id: 'dark', label: '深色' },
];

export default function MeScreen() {
  const theme = useTheme();
  const { snapshot, patchSettings } = useApp();
  const [bioLabel, setBioLabel] = useState('Face ID');
  const [bioMessage, setBioMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const premium = snapshot.settings.adsRemoved;

  useEffect(() => {
    getBiometricCapability().then((cap) => {
      setBioLabel(cap.label);
      setBioMessage(cap.message);
    });
  }, []);

  async function buy() {
    setBusy(true);
    try {
      const result = await purchaseRemoveAds();
      if (result.ok) {
        patchSettings({ adsRemoved: true, adsRemovedSource: result.source });
      }
      Alert.alert(result.ok ? '完成' : '未完成', result.message);
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    setBusy(true);
    try {
      const result = await restoreRemoveAds(premium);
      if (result.ok) patchSettings({ adsRemoved: true });
      Alert.alert(result.ok ? '已恢復' : '沒有可恢復的購買', result.message);
    } finally {
      setBusy(false);
    }
  }

  async function exportData(kind: 'csv' | 'json') {
    if (!premium) {
      Alert.alert('需要去除廣告', '匯出 CSV／JSON 與 Face ID 鎖包含在 NT$60 一次買斷。');
      return;
    }
    try {
      if (kind === 'csv') {
        await shareTextFile('subassist-subscriptions.csv', subscriptionsToCsv(snapshot.subscriptions), 'text/csv');
      } else {
        await shareTextFile('subassist-backup.json', snapshotToJson(snapshot), 'application/json');
      }
    } catch (error) {
      Alert.alert('匯出失敗', error instanceof Error ? error.message : '無法分享檔案');
    }
  }

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 48 }}>
          <AppText type="hero">我的</AppText>

          <SyncStatusBanner />

          <Card>
            <AppText type="subtitle">去除廣告</AppText>
            <AppText type="body" color={theme.textSecondary}>
              一次買斷 {REMOVE_ADS_PRICE_LABEL}，關掉總覽與訂閱底部橫幅，並解鎖匯出與{bioLabel}鎖。核心記帳與大掃除維持免費。
            </AppText>
            <AppText type="caption" color={theme.textSecondary}>
              {premium
                ? `已解鎖（${snapshot.settings.adsRemovedSource === 'stub' ? '本機模擬' : '商店'}）`
                : iapFootnote()}
            </AppText>
            {premium ? (
              <GhostButton title="已去除廣告" />
            ) : (
              <PrimaryButton title={`去除廣告 ${REMOVE_ADS_PRICE_LABEL}`} loading={busy} onPress={() => void buy()} />
            )}
            <GhostButton title="恢復購買" onPress={() => void restore()} />
          </Card>

          <Card>
            <AppText type="subtitle">外觀</AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {THEMES.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  selected={snapshot.settings.theme === item.id}
                  onPress={() => patchSettings({ theme: item.id })}
                />
              ))}
            </View>
          </Card>

          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <AppText type="subtitle">{bioLabel} 鎖</AppText>
                <AppText type="caption" color={theme.textSecondary}>
                  {premium ? bioMessage : `包含在去除廣告方案中。開啟後，回到 App 會要求${bioLabel}。`}
                </AppText>
              </View>
              <Switch
                value={snapshot.settings.faceIdEnabled && premium}
                onValueChange={(value) => {
                  if (!premium) {
                    Alert.alert('需要去除廣告', `${bioLabel} 鎖包含在 NT$60 一次買斷。`);
                    return;
                  }
                  patchSettings({ faceIdEnabled: value });
                }}
                trackColor={{ true: theme.accent }}
              />
            </View>
          </Card>

          <Card>
            <AppText type="subtitle">匯出</AppText>
            <AppText type="caption" color={theme.textSecondary}>
              匯出僅含你手動輸入的訂閱與清單進度，不含銀行或信箱資料。
            </AppText>
            <GhostButton title="匯出 CSV" onPress={() => void exportData('csv')} />
            <GhostButton title="匯出 JSON 備份" onPress={() => void exportData('json')} />
          </Card>

          <Card>
            <AppText type="subtitle">關於</AppText>
            <Pressable onPress={() => router.push('/privacy')}>
              <AppText type="body">隱私權政策</AppText>
            </Pressable>
            <Pressable onPress={() => router.push('/terms')}>
              <AppText type="body">使用條款</AppText>
            </Pressable>
            <AppText type="caption" color={theme.textSecondary}>
              訂閱助手 sub-assist {Constants.expoConfig?.version ?? '1.0.0'} · app.subassist.tw
            </AppText>
            <Pressable onPress={() => void Linking.openURL(PRIVACY_URL)}>
              <AppText type="caption" color={theme.accent}>
                {PRIVACY_URL}
              </AppText>
            </Pressable>
            <Pressable onPress={() => void Linking.openURL(TERMS_URL)}>
              <AppText type="caption" color={theme.accent}>
                {TERMS_URL}
              </AppText>
            </Pressable>
            <AppText type="caption" color={theme.textSecondary}>
              不讀銀行、不讀信箱、不自動取消第三方。
            </AppText>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
