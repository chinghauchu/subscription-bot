import { AppText, Card, ProgressBar, Screen } from '@/components/ui';
import { CLEANUP_TEMPLATES } from '@/data/cleanupTemplates';
import { useTheme } from '@/hooks/use-theme';
import { cleanupProgressPercent, useApp } from '@/store/AppProvider';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CleanupHomeScreen() {
  const theme = useTheme();
  const { snapshot } = useApp();

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
          <View>
            <AppText type="hero">大掃除</AppText>
            <AppText type="body" color={theme.textSecondary}>
              人生轉彎時，把該停的訂閱一項項打勾。本 App 不會登入第三方，也不會自動取消。
            </AppText>
          </View>

          {CLEANUP_TEMPLATES.map((template) => {
            const progress = cleanupProgressPercent(template.id, snapshot);
            return (
              <Pressable key={template.id} onPress={() => router.push(`/cleanup/${template.id}`)}>
                {({ pressed }) => (
                  <Card
                    accent={template.accent}
                    style={{ opacity: pressed ? 0.8 : 1, gap: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <AppText type="title">
                        {template.emoji} {template.title}
                      </AppText>
                      <AppText type="label" color={theme.accent}>
                        {progress.percent}%
                      </AppText>
                    </View>
                    <AppText type="caption" color={theme.textSecondary} numberOfLines={3}>
                      {template.intro}
                    </AppText>
                    <ProgressBar percent={progress.percent} />
                    <AppText type="caption" color={theme.textSecondary}>
                      {progress.done}/{progress.total} 完成
                    </AppText>
                  </Card>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}
