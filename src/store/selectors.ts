import type { CleanupTemplateId } from '@/data/cleanupTemplates';
import { CLEANUP_TEMPLATES } from '@/data/cleanupTemplates';
import { monthlyEquivalent, taipeiDateParts, isSameMonth, daysUntil } from '@/store/dates';
import type { AppSnapshot, CleanupProgress, Settings, Subscription } from '@/store/types';
import { SNAPSHOT_VERSION } from '@/store/types';

export function defaultSettings(): Settings {
  return {
    onboardingDone: false,
    adsRemoved: false,
    adsRemovedSource: 'none',
    faceIdEnabled: false,
    theme: 'system',
  };
}

export function emptyCleanup(): Record<CleanupTemplateId, CleanupProgress> {
  const now = new Date().toISOString();
  return CLEANUP_TEMPLATES.reduce(
    (acc, template) => {
      acc[template.id] = {
        templateId: template.id,
        checkedIds: [],
        customItems: [],
        updatedAt: now,
      };
      return acc;
    },
    {} as Record<CleanupTemplateId, CleanupProgress>,
  );
}

export function emptySnapshot(): AppSnapshot {
  return {
    version: SNAPSHOT_VERSION,
    subscriptions: [],
    deletedSubscriptionIds: [],
    cleanup: emptyCleanup(),
    settings: defaultSettings(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeSnapshot(input: unknown): AppSnapshot | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Partial<AppSnapshot>;
  const base = emptySnapshot();
  if (raw.version !== 1 && raw.version != null) return null;

  const subscriptions = Array.isArray(raw.subscriptions)
    ? raw.subscriptions.filter(isSubscription)
    : [];
  const deletedSubscriptionIds = Array.isArray(raw.deletedSubscriptionIds)
    ? raw.deletedSubscriptionIds.filter((id): id is string => typeof id === 'string')
    : [];

  const cleanup = emptyCleanup();
  if (raw.cleanup && typeof raw.cleanup === 'object') {
    for (const template of CLEANUP_TEMPLATES) {
      const incoming = (raw.cleanup as Record<string, CleanupProgress>)[template.id];
      if (incoming && Array.isArray(incoming.checkedIds)) {
        cleanup[template.id] = {
          templateId: template.id,
          checkedIds: incoming.checkedIds.filter((id) => typeof id === 'string'),
          customItems: Array.isArray(incoming.customItems)
            ? incoming.customItems.filter(
                (item) => item && typeof item.id === 'string' && typeof item.title === 'string',
              )
            : [],
          updatedAt: typeof incoming.updatedAt === 'string' ? incoming.updatedAt : base.updatedAt,
        };
      }
    }
  }

  const settings: Settings = {
    ...defaultSettings(),
    ...(raw.settings && typeof raw.settings === 'object' ? raw.settings : {}),
  };

  return {
    version: 1,
    subscriptions,
    deletedSubscriptionIds,
    cleanup,
    settings,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

function isSubscription(value: unknown): value is Subscription {
  if (!value || typeof value !== 'object') return false;
  const item = value as Subscription;
  return typeof item.id === 'string' && typeof item.name === 'string' && typeof item.amountNtd === 'number';
}

export function mergeSnapshots(local: AppSnapshot, remote: AppSnapshot): AppSnapshot {
  const deleted = new Set([...local.deletedSubscriptionIds, ...remote.deletedSubscriptionIds]);
  const byId = new Map<string, Subscription>();

  for (const item of [...local.subscriptions, ...remote.subscriptions]) {
    if (deleted.has(item.id)) continue;
    const existing = byId.get(item.id);
    if (!existing || item.updatedAt > existing.updatedAt) {
      byId.set(item.id, item);
    }
  }

  const cleanup = emptyCleanup();
  for (const template of CLEANUP_TEMPLATES) {
    const a = local.cleanup[template.id];
    const b = remote.cleanup[template.id];
    cleanup[template.id] = !b ? a : !a ? b : a.updatedAt >= b.updatedAt ? a : b;
  }

  const settings =
    (local.settings.lastLocalSaveAt ?? local.updatedAt) >= (remote.settings.lastLocalSaveAt ?? remote.updatedAt)
      ? local.settings
      : remote.settings;

  return {
    version: 1,
    subscriptions: [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant')),
    deletedSubscriptionIds: [...deleted],
    cleanup,
    settings: {
      ...settings,
      lastIcloudSyncAt: new Date().toISOString(),
    },
    updatedAt: local.updatedAt >= remote.updatedAt ? local.updatedAt : remote.updatedAt,
  };
}

export function activeSubscriptions(snapshot: AppSnapshot): Subscription[] {
  return snapshot.subscriptions.filter((item) => item.status === 'active');
}

export function overviewStats(snapshot: AppSnapshot) {
  const today = taipeiDateParts();
  const active = activeSubscriptions(snapshot);
  const thisMonth = active.filter((item) => isSameMonth(item.nextChargeAt, today));
  const upcoming = active
    .filter((item) => {
      const days = daysUntil(item.nextChargeAt, today.ymd);
      return days >= 0 && days <= 14;
    })
    .sort((a, b) => a.nextChargeAt.localeCompare(b.nextChargeAt));
  const review = snapshot.subscriptions.filter((item) => item.needsReview && item.status !== 'canceled');
  const monthTotal = thisMonth.reduce((sum, item) => sum + item.amountNtd, 0);
  const monthlyBurn = active.reduce((sum, item) => sum + monthlyEquivalent(item.amountNtd, item.cycle), 0);
  return {
    today,
    activeCount: active.length,
    thisMonthCount: thisMonth.length,
    monthTotal,
    monthlyBurn,
    upcoming,
    review,
  };
}
