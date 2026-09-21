import { Ionicons } from '@expo/vector-icons';
import { CATEGORY_ACCENT, cycleLabel } from '@/data/presets';
import type { Subscription } from '@/store/types';
import { daysUntil, formatYmdLong } from '@/store/dates';
import { AppText, Money } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { Pressable, View } from 'react-native';

export function SubscriptionRow({
  item,
  onPress,
}: {
  item: Subscription;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const days = daysUntil(item.nextChargeAt);
  const when =
    days === 0 ? '今天扣款' : days === 1 ? '明天扣款' : days < 0 ? '已過期' : `${days} 天後`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
      })}>
      <View
        style={{
          width: 10,
          height: 42,
          borderRadius: 99,
          backgroundColor: CATEGORY_ACCENT[item.category],
        }}
      />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText type="label">{item.name}</AppText>
        <AppText type="caption" color={theme.textSecondary}>
          {item.category} · {cycleLabel(item.cycle)} · {when}
        </AppText>
        <AppText type="caption" color={theme.textSecondary}>
          {formatYmdLong(item.nextChargeAt)}
        </AppText>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Money amount={item.amountNtd} size="sm" />
        {item.needsReview ? (
          <AppText type="caption" color={theme.warning}>
            待檢查
          </AppText>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
    </Pressable>
  );
}
