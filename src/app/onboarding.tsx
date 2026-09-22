import { AppText, PrimaryButton, Screen } from '@/components/ui';
import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/store/AppProvider';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SLIDES = [
  {
    title: '看清每一筆自動扣款',
    body: 'Netflix、KKBOX、電信、雲端……月費一多就容易忘。你自己新增、自己標記，總覽一眼看出本月還要扣多少。',
  },
  {
    title: '40+ 台灣服務預設',
    body: '串流、音樂、健身、外送、公用事業都有示意金額與取消提示。價格可改；取消仍要到各服務自己完成。',
  },
  {
    title: '人生轉彎，一次清',
    body: '離職、搬家、換機、賣機四份清單。本 App 不讀銀行、不讀信箱，也不會幫你自動取消第三方。',
  },
  {
    title: 'iCloud 是正式版的同步方式',
    body: '訂閱助手會把資料寫入本機，並在已登入的 iPhone／iPad 同步到 iCloud.app.subassist.tw。Expo Go 或未登入 Apple ID 時會用繁中說明，資料仍留在本機，不會閃退。',
  },
];

const MARKS = ['◎', '✦', '🧹', '☁️'];

export default function OnboardingScreen() {
  const theme = useTheme();
  const { patchSettings } = useApp();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  function finish() {
    patchSettings({ onboardingDone: true });
    router.replace('/');
  }

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        <View style={{ gap: 18, flex: 1, justifyContent: 'center' }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 32,
              backgroundColor: theme.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText type="hero">{MARKS[index]}</AppText>
          </View>
          <AppText type="caption" color={theme.accent}>
            訂閱助手
          </AppText>
          <AppText type="hero">{slide.title}</AppText>
          <AppText type="body" color={theme.textSecondary}>
            {slide.body}
          </AppText>
        </View>

        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={{
                  height: 6,
                  flex: 1,
                  borderRadius: 99,
                  backgroundColor: i <= index ? theme.accent : theme.surfaceAlt,
                }}
              />
            ))}
          </View>
          <PrimaryButton
            title={last ? '開始使用' : '繼續'}
            onPress={() => (last ? finish() : setIndex((value) => value + 1))}
          />
          <Pressable onPress={finish} style={{ alignItems: 'center', padding: 8 }}>
            <AppText type="label" color={theme.textSecondary}>
              略過
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </Screen>
  );
}
