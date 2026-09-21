import { AppText, Card, Field, Screen } from '@/components/ui';
import { flattenTemplateItems, getCleanupTemplate, type CleanupTemplateId } from '@/data/cleanupTemplates';
import { useTheme } from '@/hooks/use-theme';
import { cleanupProgressPercent, useApp } from '@/store/AppProvider';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function CleanupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const template = getCleanupTemplate(id ?? '');
  const theme = useTheme();
  const navigation = useNavigation();
  const { snapshot, toggleCleanupItem, addCustomCleanupItem, toggleCustomCleanupItem } = useApp();
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    if (template) navigation.setOptions({ title: template.title });
  }, [template, navigation]);

  if (!template) {
    return (
      <Screen>
        <View style={{ padding: 24 }}>
          <AppText>找不到這份清單。</AppText>
        </View>
      </Screen>
    );
  }

  const progress = snapshot.cleanup[template.id];
  const stats = cleanupProgressPercent(template.id as CleanupTemplateId, snapshot);
  const checked = new Set(progress.checkedIds);

  async function openLink(url: string) {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      // keep the checklist usable if the browser module is unavailable
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 48 }}>
        <Card>
          <AppText type="body">{template.intro}</AppText>
          <AppText type="caption" color={theme.textSecondary}>
            {stats.done}/{stats.total} 完成 · 連結打不開時，請到該服務 App／官網搜尋「取消訂閱」
          </AppText>
        </Card>

        {template.groups.map((group) => (
          <Card key={group.id}>
            <AppText type="subtitle">{group.title}</AppText>
            {group.items.map((item) => {
              const on = checked.has(item.id);
              return (
                <View key={item.id} style={{ gap: 6, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: theme.border }}>
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      toggleCleanupItem(template.id, item.id, !on);
                    }}>
                    <AppText type="label">
                      {on ? '☑' : '☐'} {item.title}
                    </AppText>
                  </Pressable>
                  {item.detail ? (
                    <AppText type="caption" color={theme.textSecondary}>
                      {item.detail}
                    </AppText>
                  ) : null}
                  {item.links?.map((link) => (
                    <Pressable key={link.url} onPress={() => void openLink(link.url)}>
                      <AppText type="caption" color={theme.accent}>
                        開啟：{link.label}
                      </AppText>
                    </Pressable>
                  ))}
                </View>
              );
            })}
          </Card>
        ))}

        <Card>
          <AppText type="subtitle">自訂項目</AppText>
          {progress.customItems.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => toggleCustomCleanupItem(template.id, item.id, !item.done)}
              style={{ paddingVertical: 8 }}>
              <AppText type="body">
                {item.done ? '☑' : '☐'} {item.title}
              </AppText>
            </Pressable>
          ))}
          <Field
            label="新增一項"
            value={customTitle}
            placeholder="例如：停公司停車場"
            onChangeText={setCustomTitle}
            onSubmitEditing={() => {
              addCustomCleanupItem(template.id, customTitle);
              setCustomTitle('');
            }}
          />
          <Pressable
            onPress={() => {
              addCustomCleanupItem(template.id, customTitle);
              setCustomTitle('');
            }}>
            <AppText type="label" color={theme.accent}>
              加入清單
            </AppText>
          </Pressable>
        </Card>

        <AppText type="caption" color={theme.textSecondary}>
          模板共 {flattenTemplateItems(template).length} 步，全部需你親自到各服務完成。
        </AppText>
      </ScrollView>
    </Screen>
  );
}
