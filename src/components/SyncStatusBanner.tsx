import { AppText, Card } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/AppProvider';
import { ActivityIndicator, Pressable, View } from 'react-native';

export function SyncStatusBanner({ compact = false }: { compact?: boolean }) {
  const { iCloud, synced, syncing, refreshSync, snapshot } = useApp();
  const theme = useTheme();
  const ok = iCloud.available && synced;
  const tone = ok ? theme.accent : theme.warning;

  return (
    <Card style={{ borderColor: tone, gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText type="label" color={tone}>
          {ok ? 'iCloud 同步中' : 'iCloud 尚未完成同步'}
        </AppText>
        {syncing ? <ActivityIndicator color={tone} /> : null}
      </View>
      <AppText type="caption" color={theme.textSecondary} numberOfLines={compact ? 2 : undefined}>
        {iCloud.message}
      </AppText>
      {snapshot.settings.lastIcloudSyncAt ? (
        <AppText type="caption" color={theme.textSecondary}>
          上次成功同步：{snapshot.settings.lastIcloudSyncAt.replace('T', ' ').slice(0, 19)}
        </AppText>
      ) : null}
      <Pressable onPress={() => void refreshSync()} hitSlop={8}>
        <AppText type="label" color={theme.accent}>
          立即同步
        </AppText>
      </Pressable>
    </Card>
  );
}
