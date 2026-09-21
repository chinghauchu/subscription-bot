import Constants from 'expo-constants';
import { Platform } from 'react-native';

type Extra = {
  admobIosAppId?: string;
  admobAndroidAppId?: string;
  admobIosBannerId?: string;
  admobAndroidBannerId?: string;
};

function extra(): Extra {
  return (Constants.expoConfig?.extra ?? {}) as Extra;
}

export function hasAdMobKeys(): boolean {
  const values = extra();
  if (Platform.OS === 'ios') return Boolean(values.admobIosAppId && values.admobIosBannerId);
  if (Platform.OS === 'android') return Boolean(values.admobAndroidAppId && values.admobAndroidBannerId);
  return false;
}

export function adBannerUnitId(): string | null {
  const values = extra();
  if (Platform.OS === 'ios') return values.admobIosBannerId?.trim() || null;
  if (Platform.OS === 'android') return values.admobAndroidBannerId?.trim() || null;
  return null;
}

export function adsEnabled(adsRemoved: boolean): boolean {
  return !adsRemoved;
}
