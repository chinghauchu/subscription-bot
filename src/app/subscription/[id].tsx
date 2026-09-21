import { SubscriptionForm, toDraft } from '@/components/SubscriptionForm';
import { AppText, Screen } from '@/components/ui';
import { useApp } from '@/store/AppProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function EditSubscriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot, upsertSubscription, deleteSubscription } = useApp();
  const item = snapshot.subscriptions.find((entry) => entry.id === id);

  if (!item) {
    return (
      <Screen>
        <View style={{ padding: 24 }}>
          <AppText>找不到這筆訂閱。</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SubscriptionForm
        initial={toDraft(item)}
        submitLabel="儲存"
        onSubmit={(draft) => {
          upsertSubscription(draft);
          router.back();
        }}
        onDelete={() => {
          deleteSubscription(item.id);
          router.back();
        }}
      />
    </Screen>
  );
}
