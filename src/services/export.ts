import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { cycleLabel } from '@/data/presets';
import type { AppSnapshot, Subscription } from '@/store/types';

function csvEscape(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function subscriptionsToCsv(subscriptions: Subscription[]): string {
  const header = [
    'id',
    'name',
    'category',
    'amount_ntd',
    'cycle',
    'next_charge',
    'status',
    'needs_review',
    'cancel_hint',
    'notes',
  ];
  const rows = subscriptions.map((item) =>
    [
      item.id,
      item.name,
      item.category,
      item.amountNtd,
      cycleLabel(item.cycle),
      item.nextChargeAt,
      item.status,
      item.needsReview ? '1' : '0',
      item.cancelHint,
      item.notes,
    ]
      .map(csvEscape)
      .join(','),
  );
  return `\uFEFF${[header.join(','), ...rows].join('\n')}`;
}

export function snapshotToJson(snapshot: AppSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

export async function shareTextFile(filename: string, contents: string, mimeType: string): Promise<void> {
  if (Platform.OS === 'web') {
    const blob = new Blob([contents], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    return;
  }

  const file = new File(Paths.cache, filename);
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(contents);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType, dialogTitle: '匯出訂閱助手' });
  }
}
