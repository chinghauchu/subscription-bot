import { CATEGORIES, TAIWAN_PRESETS, cycleLabel, type BillingCycle, type Category } from '@/data/presets';
import { Chip, Field, GhostButton, PrimaryButton } from '@/components/ui';
import type { Subscription, SubscriptionStatus } from '@/store/types';
import { addDaysYmd, endOfMonthYmd, taipeiDateParts } from '@/store/dates';
import { useTheme } from '@/hooks/use-theme';
import { AppText } from '@/components/ui';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

export type SubscriptionDraft = {
  id: string;
  name: string;
  category: Category;
  amountNtd: number;
  cycle: BillingCycle;
  nextChargeAt: string;
  notes: string;
  cancelHint: string;
  presetId?: string;
  status: SubscriptionStatus;
  needsReview: boolean;
};

const CYCLES: { id: BillingCycle; label: string }[] = [
  { id: 'month', label: '月繳' },
  { id: 'quarter', label: '季繳' },
  { id: 'year', label: '年繳' },
];

const STATUSES: { id: SubscriptionStatus; label: string }[] = [
  { id: 'active', label: '進行中' },
  { id: 'paused', label: '暫停' },
  { id: 'canceled', label: '已取消' },
];

export function SubscriptionForm({
  initial,
  onSubmit,
  onDelete,
  submitLabel,
}: {
  initial: SubscriptionDraft;
  onSubmit: (draft: SubscriptionDraft) => void;
  onDelete?: () => void;
  submitLabel: string;
}) {
  const theme = useTheme();
  const [draft, setDraft] = useState(initial);
  const [query, setQuery] = useState('');
  const [amountText, setAmountText] = useState(initial.amountNtd ? String(initial.amountNtd) : '');
  const today = taipeiDateParts().ymd;

  const presets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TAIWAN_PRESETS.filter((item) => {
      if (item.id === 'custom') return false;
      if (!q) return true;
      return item.nameZh.toLowerCase().includes(q) || item.category.includes(query.trim());
    }).slice(0, 12);
  }, [query]);

  function applyPreset(id: string) {
    const preset = TAIWAN_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setDraft((current) => ({
      ...current,
      name: preset.nameZh,
      category: preset.category,
      cycle: preset.cycle,
      cancelHint: preset.cancelHint,
      presetId: preset.id,
      amountNtd: preset.examplePriceNtd ?? current.amountNtd,
    }));
    if (preset.examplePriceNtd != null) setAmountText(String(preset.examplePriceNtd));
    setQuery(preset.nameZh);
  }

  function save() {
    const amount = Number(amountText);
    if (!draft.name.trim()) {
      Alert.alert('請填名稱', '訂閱名稱不能空白。');
      return;
    }
    if (!Number.isFinite(amount) || amount < 0) {
      Alert.alert('金額有誤', '請輸入新台幣金額（可為 0）。');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.nextChargeAt)) {
      Alert.alert('日期格式', '下次扣款請用 YYYY-MM-DD。');
      return;
    }
    onSubmit({ ...draft, name: draft.name.trim(), amountNtd: Math.round(amount) });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 48 }}>
      <Field
        label="從台灣預設挑選或搜尋"
        value={query}
        placeholder="例如 Netflix、KKBOX、中華電信"
        onChangeText={setQuery}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {presets.map((preset) => (
          <Chip
            key={preset.id}
            label={preset.nameZh}
            selected={draft.presetId === preset.id}
            onPress={() => applyPreset(preset.id)}
          />
        ))}
      </ScrollView>

      <Field label="名稱" value={draft.name} onChangeText={(name) => setDraft((c) => ({ ...c, name }))} />

      <View style={{ gap: 8 }}>
        <AppText type="label" color={theme.textSecondary}>
          分類
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={draft.category === category}
              onPress={() => setDraft((c) => ({ ...c, category }))}
            />
          ))}
        </View>
      </View>

      <Field
        label="金額（新台幣）"
        value={amountText}
        keyboardType="number-pad"
        onChangeText={setAmountText}
        placeholder="290"
      />

      <View style={{ gap: 8 }}>
        <AppText type="label" color={theme.textSecondary}>
          週期
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CYCLES.map((cycle) => (
            <Chip
              key={cycle.id}
              label={cycle.label}
              selected={draft.cycle === cycle.id}
              onPress={() => setDraft((c) => ({ ...c, cycle: cycle.id }))}
            />
          ))}
        </View>
      </View>

      <Field
        label="下次扣款日（YYYY-MM-DD）"
        value={draft.nextChargeAt}
        onChangeText={(nextChargeAt) => setDraft((c) => ({ ...c, nextChargeAt }))}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Chip label="今天" onPress={() => setDraft((c) => ({ ...c, nextChargeAt: today }))} />
        <Chip label="7 天後" onPress={() => setDraft((c) => ({ ...c, nextChargeAt: addDaysYmd(today, 7) }))} />
        <Chip label="月底" onPress={() => setDraft((c) => ({ ...c, nextChargeAt: endOfMonthYmd(today) }))} />
        <Chip label="30 天後" onPress={() => setDraft((c) => ({ ...c, nextChargeAt: addDaysYmd(today, 30) }))} />
      </View>

      <View style={{ gap: 8 }}>
        <AppText type="label" color={theme.textSecondary}>
          狀態
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STATUSES.map((status) => (
            <Chip
              key={status.id}
              label={status.label}
              selected={draft.status === status.id}
              onPress={() => setDraft((c) => ({ ...c, status: status.id }))}
            />
          ))}
        </View>
      </View>

      <Pressable onPress={() => setDraft((c) => ({ ...c, needsReview: !c.needsReview }))}>
        <AppText type="label" color={draft.needsReview ? theme.warning : theme.textSecondary}>
          {draft.needsReview ? '☑ 待檢查（總覽會提醒）' : '☐ 標為待檢查'}
        </AppText>
      </Pressable>

      <Field
        label="取消提示（僅供你自行前往）"
        value={draft.cancelHint}
        onChangeText={(cancelHint) => setDraft((c) => ({ ...c, cancelHint }))}
        multiline
      />
      <Field
        label="備註"
        value={draft.notes}
        onChangeText={(notes) => setDraft((c) => ({ ...c, notes }))}
        multiline
      />

      <PrimaryButton title={submitLabel} onPress={save} />
      {onDelete ? (
        <GhostButton
          title="刪除此筆"
          onPress={() =>
            Alert.alert('刪除訂閱', '確定刪除？此動作會同步到 iCloud（若已登入）。', [
              { text: '取消', style: 'cancel' },
              { text: '刪除', style: 'destructive', onPress: onDelete },
            ])
          }
        />
      ) : null}
    </ScrollView>
  );
}

export function toDraft(item: Subscription): SubscriptionDraft {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    amountNtd: item.amountNtd,
    cycle: item.cycle,
    nextChargeAt: item.nextChargeAt,
    notes: item.notes,
    cancelHint: item.cancelHint,
    presetId: item.presetId,
    status: item.status,
    needsReview: item.needsReview,
  };
}
