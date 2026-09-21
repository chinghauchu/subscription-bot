import type { CleanupTemplateId } from '@/data/cleanupTemplates';
import type { BillingCycle, Category } from '@/data/presets';

export type SubscriptionStatus = 'active' | 'paused' | 'canceled';
export type ThemePreference = 'system' | 'light' | 'dark';

export type Subscription = {
  id: string;
  name: string;
  category: Category;
  amountNtd: number;
  cycle: BillingCycle;
  nextChargeAt: string;
  notes: string;
  cancelHint: string;
  presetId?: string;
  status: SubscriptionStatus;
  needsReview: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomCleanupItem = {
  id: string;
  title: string;
  done: boolean;
};

export type CleanupProgress = {
  templateId: CleanupTemplateId;
  checkedIds: string[];
  customItems: CustomCleanupItem[];
  updatedAt: string;
};

export type Settings = {
  onboardingDone: boolean;
  adsRemoved: boolean;
  adsRemovedSource: 'none' | 'stub' | 'store';
  faceIdEnabled: boolean;
  theme: ThemePreference;
  lastIcloudSyncAt?: string;
  lastLocalSaveAt?: string;
};

export type AppSnapshot = {
  version: 1;
  subscriptions: Subscription[];
  deletedSubscriptionIds: string[];
  cleanup: Record<CleanupTemplateId, CleanupProgress>;
  settings: Settings;
  updatedAt: string;
};

export const SNAPSHOT_VERSION = 1 as const;
export const STORAGE_KEY = 'clearbill.snapshot.v1';
export const REMOVE_ADS_STUB_KEY = 'clearbill.iap.removeads.stub';
