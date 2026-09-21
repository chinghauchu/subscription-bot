import * as Crypto from 'expo-crypto';

export function nowIso(): string {
  return new Date().toISOString();
}

export function createId(): string {
  try {
    return Crypto.randomUUID();
  } catch {
    return `cb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export const TIME_ZONE = 'Asia/Taipei';

export function taipeiDateParts(date = new Date()): { year: number; month: number; day: number; ymd: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const day = Number(parts.find((part) => part.type === 'day')?.value);
  const ymd = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return { year, month, day, ymd };
}

export function parseYmd(ymd: string): Date {
  const [year, month, day] = ymd.split('-').map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
}

export function addDaysYmd(ymd: string, days: number): string {
  const date = parseYmd(ymd);
  date.setUTCDate(date.getUTCDate() + days);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function endOfMonthYmd(ymd: string): string {
  const [year, month] = ymd.split('-').map(Number);
  const date = new Date(Date.UTC(year, month, 0));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function formatYmdLong(ymd: string): string {
  const [year, month, day] = ymd.split('-');
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export function daysUntil(ymd: string, from = taipeiDateParts().ymd): number {
  const a = parseYmd(from).getTime();
  const b = parseYmd(ymd).getTime();
  return Math.round((b - a) / 86_400_000);
}

export function isSameMonth(ymd: string, from = taipeiDateParts()): boolean {
  return ymd.startsWith(`${from.year}-${String(from.month).padStart(2, '0')}`);
}

export function formatNtd(amount: number): string {
  const rounded = Math.round(amount);
  return `NT$${rounded.toLocaleString('zh-TW')}`;
}

export function monthlyEquivalent(amount: number, cycle: 'month' | 'quarter' | 'year'): number {
  if (cycle === 'year') return amount / 12;
  if (cycle === 'quarter') return amount / 3;
  return amount;
}

export function nextChargeAfter(currentYmd: string, cycle: 'month' | 'quarter' | 'year'): string {
  const [year, month, day] = currentYmd.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (cycle === 'year') date.setUTCFullYear(date.getUTCFullYear() + 1);
  else if (cycle === 'quarter') date.setUTCMonth(date.getUTCMonth() + 3);
  else date.setUTCMonth(date.getUTCMonth() + 1);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}
