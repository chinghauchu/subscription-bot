import { AppText, Screen } from '@/components/ui';
import { TERMS_ZH } from '@/constants/legal';
import { ScrollView } from 'react-native';

export default function TermsScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <AppText type="body">{TERMS_ZH}</AppText>
      </ScrollView>
    </Screen>
  );
}
