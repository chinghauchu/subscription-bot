import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export type BiometricCapability = {
  available: boolean;
  enrolled: boolean;
  label: string;
  message: string;
};

export async function getBiometricCapability(): Promise<BiometricCapability> {
  if (Platform.OS === 'web') {
    return {
      available: false,
      enrolled: false,
      label: 'Face ID',
      message: '網頁版無法使用 Face ID。請在 iPhone 上開啟鎖定。',
    };
  }

  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = hasHardware ? await LocalAuthentication.isEnrolledAsync() : false;
    const types = hasHardware ? await LocalAuthentication.supportedAuthenticationTypesAsync() : [];
    const hasFace = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
    const hasFinger = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
    const label = hasFace ? 'Face ID' : hasFinger ? '指紋解鎖' : '裝置解鎖';

    if (!hasHardware) {
      return { available: false, enrolled: false, label, message: '這台裝置沒有 Face ID／指紋硬體。' };
    }
    if (!enrolled) {
      return { available: true, enrolled: false, label, message: `請先在系統設定登錄${label}。` };
    }
    return { available: true, enrolled: true, label, message: `開啟後，回到 App 時會要求${label}。` };
  } catch {
    return {
      available: false,
      enrolled: false,
      label: 'Face ID',
      message: '無法檢查生物辨識（Expo Go 或缺少權限時會發生）。不會因此閃退。',
    };
  }
}

export async function promptUnlock(label = 'Face ID'): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: `解鎖扣款清（${label}）`,
      cancelLabel: '取消',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}
