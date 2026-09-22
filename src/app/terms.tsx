import { AppText, Screen } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { TERMS_URL, TERMS_ZH } from '@/constants/legal';
import { Linking, Pressable, ScrollView } from 'react-native';

export default function TermsScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48, gap: 16 }}>
        <Pressable onPress={() => void Linking.openURL(TERMS_URL)}>
          <AppText type="caption" color={theme.accent}>
            {TERMS_URL}
          </AppText>
        </Pressable>
        <AppText type="body">{TERMS_ZH}</AppText>
      </ScrollView>
    </Screen>
  );
}
