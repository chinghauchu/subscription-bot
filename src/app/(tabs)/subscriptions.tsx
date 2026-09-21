import { Ionicons } from '@expo/vector-icons';
import { BannerAdSlot } from '@/components/BannerAdSlot';
import { SubscriptionRow } from '@/components/SubscriptionRow';
import { AppText, Chip, Screen } from '@/components/ui';
import { CATEGORIES, type Category } from '@/data/presets';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/AppProvider';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubscriptionsScreen() {
  const theme = useTheme();
  const { snapshot } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | '全部'>('全部');

  const items = useMemo(() => {
    return snapshot.subscriptions
      .filter((item) => item.status !== 'canceled')
      .filter((item) => (category === '全部' ? true : item.category === category))
      .filter((item) => {
        const q = query.trim();
        if (!q) return true;
        return item.name.includes(q) || item.category.includes(q);
      })
      .sort((a, b) => a.nextChargeAt.localeCompare(b.nextChargeAt));
  }, [snapshot.subscriptions, query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const item of items) {
      const key = item.category;
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()];
  }, [items]);

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <AppText type="hero">訂閱</AppText>
            <Pressable
              onPress={() => router.push('/subscription/new')}
              style={{
                backgroundColor: theme.accent,
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="add" size={26} color="#fff" />
            </Pressable>
          </View>
          <TextInput
            placeholder="搜尋名稱或分類"
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            style={{
              minHeight: 46,
              borderRadius: 14,
              paddingHorizontal: 14,
              backgroundColor: theme.surface,
              color: theme.text,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <Chip label="全部" selected={category === '全部'} onPress={() => setCategory('全部')} />
            {CATEGORIES.map((item) => (
              <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 28 }}>
          {items.length === 0 ? (
            <View style={{ gap: 8, paddingVertical: 24 }}>
              <AppText type="subtitle">還沒有訂閱</AppText>
              <AppText type="body" color={theme.textSecondary}>
                內建 50+ 台灣常見服務預設。金額可改，取消要到各服務自己完成。
              </AppText>
            </View>
          ) : (
            grouped.map(([group, rows]) => (
              <View key={group} style={{ gap: 4 }}>
                <AppText type="label" color={theme.textSecondary}>
                  {group}
                </AppText>
                <View
                  style={{
                    backgroundColor: theme.surface,
                    borderRadius: 18,
                    paddingHorizontal: 14,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}>
                  {rows.map((item) => (
                    <SubscriptionRow
                      key={item.id}
                      item={item}
                      onPress={() => router.push(`/subscription/${item.id}`)}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
        <BannerAdSlot />
      </SafeAreaView>
    </Screen>
  );
}
