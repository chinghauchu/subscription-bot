import { adsEnabled, hasAdMobKeys } from '@/services/ads';
import { AppText } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/AppProvider';
import { StyleSheet, View } from 'react-native';

export function BannerAdSlot() {
  const { snapshot } = useApp();
  const theme = useTheme();
  if (!adsEnabled(snapshot.settings.adsRemoved)) return null;

  return (
    <View style={[styles.wrap, { backgroundColor: theme.adSlot, borderColor: theme.border }]}>
      <AppText type="caption" color={theme.textSecondary}>
        {hasAdMobKeys()
          ? '廣告'
          : '廣告橫幅預留（尚未設定 AdMob 金鑰，不會載入廣告 SDK，也不會閃退）'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 52,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
