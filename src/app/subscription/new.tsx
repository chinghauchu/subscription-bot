import { SubscriptionForm, type SubscriptionDraft } from '@/components/SubscriptionForm';
import { Screen } from '@/components/ui';
import { createId, taipeiDateParts } from '@/store/dates';
import { useApp } from '@/store/AppProvider';
import { router } from 'expo-router';

export default function NewSubscriptionScreen() {
  const { upsertSubscription } = useApp();
  const today = taipeiDateParts().ymd;

  const initial: SubscriptionDraft = {
    id: createId(),
    name: '',
    category: '其他',
    amountNtd: 0,
    cycle: 'month',
    nextChargeAt: today,
    notes: '',
    cancelHint: '',
    status: 'active',
    needsReview: false,
  };

  return (
    <Screen>
      <SubscriptionForm
        initial={initial}
        submitLabel="新增"
        onSubmit={(draft) => {
          upsertSubscription(draft);
          router.back();
        }}
      />
    </Screen>
  );
}
