import { CLEANUP_TEMPLATES, type CleanupTemplateId } from '@/data/cleanupTemplates';
import { getICloudStatus, subscribeICloudChanges, type ICloudStatus } from '@/services/icloud';
import { createId, nowIso } from '@/store/dates';
import { loadMergedSnapshot, persistSnapshot } from '@/store/repository';
import type { AppSnapshot, Settings, Subscription } from '@/store/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type AppContextValue = {
  ready: boolean;
  snapshot: AppSnapshot;
  iCloud: ICloudStatus;
  synced: boolean;
  syncing: boolean;
  refreshSync: () => Promise<void>;
  updateSnapshot: (recipe: (current: AppSnapshot) => AppSnapshot) => void;
  upsertSubscription: (input: Omit<Subscription, 'createdAt' | 'updatedAt'> & { createdAt?: string }) => void;
  deleteSubscription: (id: string) => void;
  toggleCleanupItem: (templateId: CleanupTemplateId, itemId: string, checked: boolean) => void;
  addCustomCleanupItem: (templateId: CleanupTemplateId, title: string) => void;
  toggleCustomCleanupItem: (templateId: CleanupTemplateId, itemId: string, done: boolean) => void;
  patchSettings: (patch: Partial<Settings>) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [snapshot, setSnapshot] = useState<AppSnapshot>(() => ({
    version: 1,
    subscriptions: [],
    deletedSubscriptionIds: [],
    cleanup: {
      quit: { templateId: 'quit', checkedIds: [], customItems: [], updatedAt: nowIso() },
      move: { templateId: 'move', checkedIds: [], customItems: [], updatedAt: nowIso() },
      new_phone: { templateId: 'new_phone', checkedIds: [], customItems: [], updatedAt: nowIso() },
      sell_phone: { templateId: 'sell_phone', checkedIds: [], customItems: [], updatedAt: nowIso() },
    },
    settings: {
      onboardingDone: false,
      adsRemoved: false,
      adsRemovedSource: 'none',
      faceIdEnabled: false,
      theme: 'system',
    },
    updatedAt: nowIso(),
  }));
  const [iCloud, setICloud] = useState<ICloudStatus>(() => getICloudStatus());
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(async (current: AppSnapshot) => {
    setSyncing(true);
    try {
      const result = await persistSnapshot(current);
      setSnapshot(result.snapshot);
      setSynced(result.synced);
      setICloud(getICloudStatus());
    } finally {
      setSyncing(false);
    }
  }, []);

  const updateSnapshot = useCallback(
    (recipe: (current: AppSnapshot) => AppSnapshot) => {
      setSnapshot((current) => {
        const next = recipe(current);
        if (persistTimer.current) clearTimeout(persistTimer.current);
        persistTimer.current = setTimeout(() => {
          void flush(next);
        }, 400);
        return next;
      });
    },
    [flush],
  );

  const refreshSync = useCallback(async () => {
    setSyncing(true);
    try {
      const result = await loadMergedSnapshot();
      setSnapshot(result.snapshot);
      setSynced(result.synced);
      setICloud(getICloudStatus());
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await loadMergedSnapshot();
      if (cancelled) return;
      setSnapshot(result.snapshot);
      setSynced(result.synced);
      setICloud(getICloudStatus());
      setReady(true);
    })();
    const unsubscribe = subscribeICloudChanges(() => {
      setICloud(getICloudStatus());
      void refreshSync();
    });
    return () => {
      cancelled = true;
      unsubscribe();
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [refreshSync]);

  const upsertSubscription: AppContextValue['upsertSubscription'] = useCallback(
    (input) => {
      updateSnapshot((current) => {
        const existing = current.subscriptions.find((item) => item.id === input.id);
        const record: Subscription = {
          ...input,
          createdAt: existing?.createdAt ?? input.createdAt ?? nowIso(),
          updatedAt: nowIso(),
        };
        const subscriptions = existing
          ? current.subscriptions.map((item) => (item.id === record.id ? record : item))
          : [...current.subscriptions, record];
        return {
          ...current,
          subscriptions,
          deletedSubscriptionIds: current.deletedSubscriptionIds.filter((id) => id !== record.id),
          updatedAt: nowIso(),
        };
      });
    },
    [updateSnapshot],
  );

  const deleteSubscription = useCallback(
    (id: string) => {
      updateSnapshot((current) => ({
        ...current,
        subscriptions: current.subscriptions.filter((item) => item.id !== id),
        deletedSubscriptionIds: [...new Set([...current.deletedSubscriptionIds, id])],
        updatedAt: nowIso(),
      }));
    },
    [updateSnapshot],
  );

  const toggleCleanupItem = useCallback(
    (templateId: CleanupTemplateId, itemId: string, checked: boolean) => {
      updateSnapshot((current) => {
        const progress = current.cleanup[templateId];
        const checkedIds = checked
          ? [...new Set([...progress.checkedIds, itemId])]
          : progress.checkedIds.filter((id) => id !== itemId);
        return {
          ...current,
          cleanup: {
            ...current.cleanup,
            [templateId]: { ...progress, checkedIds, updatedAt: nowIso() },
          },
          updatedAt: nowIso(),
        };
      });
    },
    [updateSnapshot],
  );

  const addCustomCleanupItem = useCallback(
    (templateId: CleanupTemplateId, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      updateSnapshot((current) => {
        const progress = current.cleanup[templateId];
        return {
          ...current,
          cleanup: {
            ...current.cleanup,
            [templateId]: {
              ...progress,
              customItems: [...progress.customItems, { id: createId(), title: trimmed, done: false }],
              updatedAt: nowIso(),
            },
          },
          updatedAt: nowIso(),
        };
      });
    },
    [updateSnapshot],
  );

  const toggleCustomCleanupItem = useCallback(
    (templateId: CleanupTemplateId, itemId: string, done: boolean) => {
      updateSnapshot((current) => {
        const progress = current.cleanup[templateId];
        return {
          ...current,
          cleanup: {
            ...current.cleanup,
            [templateId]: {
              ...progress,
              customItems: progress.customItems.map((item) => (item.id === itemId ? { ...item, done } : item)),
              updatedAt: nowIso(),
            },
          },
          updatedAt: nowIso(),
        };
      });
    },
    [updateSnapshot],
  );

  const patchSettings = useCallback(
    (patch: Partial<Settings>) => {
      updateSnapshot((current) => ({
        ...current,
        settings: { ...current.settings, ...patch },
        updatedAt: nowIso(),
      }));
    },
    [updateSnapshot],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      snapshot,
      iCloud,
      synced,
      syncing,
      refreshSync,
      updateSnapshot,
      upsertSubscription,
      deleteSubscription,
      toggleCleanupItem,
      addCustomCleanupItem,
      toggleCustomCleanupItem,
      patchSettings,
    }),
    [
      ready,
      snapshot,
      iCloud,
      synced,
      syncing,
      refreshSync,
      updateSnapshot,
      upsertSubscription,
      deleteSubscription,
      toggleCleanupItem,
      addCustomCleanupItem,
      toggleCustomCleanupItem,
      patchSettings,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used within AppProvider');
  return value;
}

export function cleanupProgressPercent(
  templateId: CleanupTemplateId,
  snapshot: AppSnapshot,
): { done: number; total: number; percent: number } {
  const template = CLEANUP_TEMPLATES.find((item) => item.id === templateId);
  const progress = snapshot.cleanup[templateId];
  const templateCount = template?.groups.reduce((sum, group) => sum + group.items.length, 0) ?? 0;
  const customCount = progress.customItems.length;
  const total = templateCount + customCount;
  const done =
    progress.checkedIds.filter((id) => template?.groups.some((group) => group.items.some((item) => item.id === id)))
      .length + progress.customItems.filter((item) => item.done).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}
