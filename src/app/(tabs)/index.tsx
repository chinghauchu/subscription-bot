import { BannerAdSlot } from '@/components/BannerAdSlot';
import { SubscriptionRow } from '@/components/SubscriptionRow';
import { SyncStatusBanner } from '@/components/SyncStatusBanner';
import { AppText, Card, Money, PrimaryButton, Screen } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/AppProvider';
import { overviewStats } from '@/store/selectors';
import { formatYmdLong } from '@/store/dates';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OverviewScreen() {
  const theme = useTheme();
  const { snapshot } = useApp();
  const stats = overviewStats(snapshot);

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 28 }}>
          <View>
            <AppText type="caption" color={theme.textSecondary}>
              {formatYmdLong(stats.today.ymd)} · 台灣
            </AppText>
            <AppText type="hero">總覽</AppText>
            <AppText type="body" color={theme.textSecondary}>
              看清本月還要扣多少。資料由你手動記錄，不讀銀行或信箱。
            </AppText>
          </View>

          <Card>
            <AppText type="label" color={theme.textSecondary}>
              本月還要扣
            </AppText>
            <Money amount={stats.monthTotal} size="xl" />
            <AppText type="caption" color={theme.textSecondary}>
              {stats.thisMonthCount} 筆將在本月扣款 · 進行中 {stats.activeCount} 筆
            </AppText>
          </Card>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Card style={{ flex: 1 }}>
              <AppText type="caption" color={theme.textSecondary}>
                每月換算
              </AppText>
              <Money amount={Math.round(stats.monthlyBurn)} size="sm" />
            </Card>
            <Card style={{ flex: 1 }}>
              <AppText type="caption" color={theme.textSecondary}>
                待檢查
              </AppText>
              <AppText type="title" color={stats.review.length ? theme.warning : theme.text}>
                {stats.review.length}
              </AppText>
            </Card>
          </View>

          <SyncStatusBanner compact />

          <Card>
            <AppText type="subtitle">即將扣款</AppText>
            <AppText type="caption" color={theme.textSecondary}>
              未來 14 天
            </AppText>
            {stats.upcoming.length === 0 ? (
              <View style={{ gap: 12, paddingVertical: 8 }}>
                <AppText type="body" color={theme.textSecondary}>
                  還沒有即將扣款的項目。從台灣常見服務新增一筆吧。
                </AppText>
                <PrimaryButton title="新增訂閱" onPress={() => router.push('/subscription/new')} />
              </View>
            ) : (
              stats.upcoming.map((item) => (
                <SubscriptionRow
                  key={item.id}
                  item={item}
                  onPress={() => router.push(`/subscription/${item.id}`)}
                />
              ))
            )}
          </Card>

          {stats.review.length > 0 ? (
            <Card>
              <AppText type="subtitle">待再檢查</AppText>
              {stats.review.map((item) => (
                <SubscriptionRow
                  key={item.id}
                  item={item}
                  onPress={() => router.push(`/subscription/${item.id}`)}
                />
              ))}
            </Card>
          ) : null}
        </ScrollView>
        <BannerAdSlot />
      </SafeAreaView>
    </Screen>
  );
}
