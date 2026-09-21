import { AppText, Screen } from '@/components/ui';
import { PRIVACY_ZH } from '@/constants/legal';
import { ScrollView } from 'react-native';

export default function PrivacyScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <AppText type="body">{PRIVACY_ZH}</AppText>
      </ScrollView>
    </Screen>
  );
}
