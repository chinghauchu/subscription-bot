import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { requireOptionalNativeModule } from 'expo-modules-core';

import type { ClearbillIcloudModuleView, ICloudNativeStatus } from '../../modules/clearbill-icloud';

export type ICloudReason =
  | 'ok'
  | 'signed-out'
  | 'container-unavailable'
  | 'expo-go'
  | 'android'
  | 'web'
  | 'unsupported'
  | 'error';

export type ICloudStatus = {
  available: boolean;
  signedIn: boolean;
  reason: ICloudReason;
  native: boolean;
  message: string;
  containerPath?: string;
  kvUpdatedAt?: string;
};

const MESSAGES: Record<ICloudReason, string> = {
  ok: 'iCloud 已連線，訂閱與大掃除會跨裝置同步。',
  'signed-out': '尚未登入 iCloud。請到「設定」登入 Apple ID 後回到扣款清，資料才會跨裝置同步。目前僅存在本機。',
  'container-unavailable':
    '找不到 iCloud 容器。請確認此裝置已登入 iCloud，且使用開發版或 App Store 版本（非 Expo Go）。資料目前僅存在本機。',
  'expo-go': 'Expo Go 無法使用 iCloud 原生同步。請改用開發版或 App Store 版本；現在資料只存在本機。',
  android: 'iCloud 同步僅支援 iPhone／iPad。這台裝置的資料存在本機，可用匯出備份。',
  web: '網頁版僅供預覽，不會寫入 iCloud。請在 iPhone 上使用完整版。',
  unsupported: '這台裝置無法使用 iCloud 同步。資料僅存在本機。',
  error: '讀取 iCloud 狀態時發生問題。資料仍會先存在本機。',
};

function getNative(): ClearbillIcloudModuleView | null {
  try {
    return requireOptionalNativeModule<ClearbillIcloudModuleView>('ClearbillIcloud');
  } catch {
    return null;
  }
}

export function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export function getICloudStatus(): ICloudStatus {
  if (Platform.OS === 'web') {
    return { available: false, signedIn: false, reason: 'web', native: false, message: MESSAGES.web };
  }
  if (Platform.OS === 'android') {
    return { available: false, signedIn: false, reason: 'android', native: false, message: MESSAGES.android };
  }
  if (isExpoGo()) {
    return { available: false, signedIn: false, reason: 'expo-go', native: false, message: MESSAGES['expo-go'] };
  }

  const native = getNative();
  if (!native) {
    return {
      available: false,
      signedIn: false,
      reason: 'unsupported',
      native: false,
      message: MESSAGES.unsupported,
    };
  }

  try {
    const status: ICloudNativeStatus = native.getStatus();
    const reason = (status.reason as ICloudReason) || (status.available ? 'ok' : 'unsupported');
    return {
      available: Boolean(status.available),
      signedIn: Boolean(status.signedIn),
      reason,
      native: true,
      message: MESSAGES[reason] ?? MESSAGES.unsupported,
      containerPath: status.containerPath,
      kvUpdatedAt: status.kvUpdatedAt,
    };
  } catch {
    return { available: false, signedIn: false, reason: 'error', native: true, message: MESSAGES.error };
  }
}

export async function readICloudSnapshot(): Promise<string | null> {
  const native = getNative();
  if (!native) return null;
  try {
    await native.synchronize();
    return (await native.readSnapshot()) ?? null;
  } catch {
    return null;
  }
}

export async function writeICloudSnapshot(json: string): Promise<{ ok: boolean; error?: string }> {
  const native = getNative();
  if (!native) return { ok: false, error: 'native-unavailable' };
  try {
    await native.writeSnapshot(json);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'write-failed' };
  }
}

export function subscribeICloudChanges(onChange: () => void): () => void {
  const native = getNative();
  if (!native?.addListener) return () => {};
  const account = native.addListener('onAccountChanged', onChange);
  const store = native.addListener('onStoreChanged', onChange);
  return () => {
    account.remove();
    store.remove();
  };
}
