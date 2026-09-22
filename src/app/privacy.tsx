import { AppText, Screen } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { PRIVACY_URL, PRIVACY_ZH } from '@/constants/legal';
import { Linking, Pressable, ScrollView } from 'react-native';

export default function PrivacyScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48, gap: 16 }}>
        <Pressable onPress={() => void Linking.openURL(PRIVACY_URL)}>
          <AppText type="caption" color={theme.accent}>
            {PRIVACY_URL}
          </AppText>
        </Pressable>
        <AppText type="body">{PRIVACY_ZH}</AppText>
      </ScrollView>
    </Screen>
  );
}
