import AsyncStorage from '@react-native-async-storage/async-storage';

import { readICloudSnapshot, writeICloudSnapshot, getICloudStatus } from '@/services/icloud';
import { emptySnapshot, mergeSnapshots, normalizeSnapshot } from '@/store/selectors';
import { STORAGE_KEY, type AppSnapshot } from '@/store/types';

export async function loadLocalSnapshot(): Promise<AppSnapshot> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySnapshot();
    return normalizeSnapshot(JSON.parse(raw)) ?? emptySnapshot();
  } catch {
    return emptySnapshot();
  }
}

export async function saveLocalSnapshot(snapshot: AppSnapshot): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export async function loadMergedSnapshot(): Promise<{
  snapshot: AppSnapshot;
  synced: boolean;
  syncError?: string;
}> {
  const local = await loadLocalSnapshot();
  const status = getICloudStatus();
  if (!status.available) {
    return { snapshot: local, synced: false, syncError: status.reason };
  }

  const remoteRaw = await readICloudSnapshot();
  if (!remoteRaw) {
    const write = await writeICloudSnapshot(JSON.stringify(local));
    return { snapshot: local, synced: write.ok, syncError: write.error };
  }

  try {
    const remote = normalizeSnapshot(JSON.parse(remoteRaw));
    if (!remote) {
      return { snapshot: local, synced: false, syncError: 'invalid-remote' };
    }
    const merged = mergeSnapshots(local, remote);
    await saveLocalSnapshot(merged);
    const write = await writeICloudSnapshot(JSON.stringify(merged));
    return { snapshot: merged, synced: write.ok, syncError: write.error };
  } catch {
    return { snapshot: local, synced: false, syncError: 'parse-failed' };
  }
}

export async function persistSnapshot(snapshot: AppSnapshot): Promise<{ snapshot: AppSnapshot; synced: boolean; error?: string }> {
  const next: AppSnapshot = {
    ...snapshot,
    settings: { ...snapshot.settings, lastLocalSaveAt: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  };
  await saveLocalSnapshot(next);
  const status = getICloudStatus();
  if (!status.available) return { snapshot: next, synced: false, error: status.reason };
  const write = await writeICloudSnapshot(JSON.stringify(next));
  const withSync: AppSnapshot = {
    ...next,
    settings: {
      ...next.settings,
      lastIcloudSyncAt: write.ok ? new Date().toISOString() : next.settings.lastIcloudSyncAt,
    },
  };
  if (write.ok) await saveLocalSnapshot(withSync);
  return { snapshot: write.ok ? withSync : next, synced: write.ok, error: write.error };
}
