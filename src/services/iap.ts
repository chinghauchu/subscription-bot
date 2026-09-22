import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const REMOVE_ADS_PRICE_LABEL = 'NT$60';
export const REMOVE_ADS_PRODUCT_FALLBACK = 'subassist_remove_ads';

type Extra = {
  iapRemoveAdsProductId?: string;
  admobIosBannerId?: string;
  admobAndroidBannerId?: string;
  admobIosAppId?: string;
  admobAndroidAppId?: string;
};

function extra(): Extra {
  return (Constants.expoConfig?.extra ?? {}) as Extra;
}

export function getRemoveAdsProductId(): string {
  const id = extra().iapRemoveAdsProductId?.trim();
  return id || REMOVE_ADS_PRODUCT_FALLBACK;
}

export function hasStoreIapKeys(): boolean {
  const id = extra().iapRemoveAdsProductId?.trim();
  return Boolean(id);
}

export type PurchaseResult = {
  ok: boolean;
  source: 'stub' | 'store' | 'none';
  message: string;
};

/**
 * StoreKit is not wired until a real product id is configured in App Store Connect.
 * Missing keys must not crash — we persist a local stub entitlement instead.
 */
export async function purchaseRemoveAds(): Promise<PurchaseResult> {
  if (!hasStoreIapKeys()) {
    return {
      ok: true,
      source: 'stub',
      message: '尚未設定 App Store 產品編號。已在本機模擬一次買斷（開發用），上架前請填 EXPO_PUBLIC_IAP_REMOVE_ADS_ID。',
    };
  }

  try {
    // Native IAP is intentionally not imported: missing StoreKit / Expo Go must not crash.
    return {
      ok: true,
      source: 'stub',
      message: `已記錄產品「${getRemoveAdsProductId()}」。連線 App Store 購買流程會在開發版＋有效產品編號後啟用；目前先完成本機解鎖。`,
    };
  } catch (error) {
    return {
      ok: false,
      source: 'none',
      message: error instanceof Error ? error.message : '購買未完成。',
    };
  }
}

export async function restoreRemoveAds(alreadyOwned: boolean): Promise<PurchaseResult> {
  if (alreadyOwned) {
    return { ok: true, source: 'store', message: '已恢復：廣告已關閉。' };
  }
  if (!hasStoreIapKeys()) {
    return {
      ok: false,
      source: 'none',
      message: '目前沒有可恢復的 App Store 購買（產品編號尚未設定）。若你曾在本機模擬買斷，狀態仍會保留。',
    };
  }
  return {
    ok: false,
    source: 'none',
    message: 'App Store 沒有找到此帳號的「去除廣告」購買紀錄。',
  };
}

export function iapFootnote(): string {
  if (Platform.OS === 'web') return '網頁版無法連接 App Store。';
  if (!hasStoreIapKeys()) return 'IAP 產品編號尚未設定，購買按鈕不會連線商店，也不會閃退。';
  return '一次買斷 NT$60，去除底部廣告，並解鎖匯出與 Face ID 鎖。';
}
