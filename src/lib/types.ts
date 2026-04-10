export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // Day of month (1-31)
  category?: string;
  emoji?: string; // Emoji icon for the bill
  color?: string; // Color hex code for the bill
  isRecurring: boolean; // true = resets monthly, false = one-time payment
  isVariableAmount: boolean; // true = amount resets to 0 each month, false = fixed amount
  isPaid: boolean;
  lastPaidDate?: string; // ISO date string
}

export const BILL_EMOJIS = [
  '💡', '🏠', '💧', '📱', '🌐', '🎬', '🎵', '🏥',
  '🚗', '⛽', '🛡️', '💳', '🏦', '📦', '🛒', '✈️',
] as const;

export const BILL_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#78716c', // stone
] as const;

export interface PaymentRecord {
  id: string;
  billId: string;
  billName: string;
  paidDate: string; // ISO date string
  amount: number;
  monthYear: string; // "2025-12" format
}

export type BillFormData = Omit<Bill, 'id' | 'isPaid' | 'lastPaidDate'>;

export const CATEGORIES = [
  'Housing',
  'Utilities',
  'Insurance',
  'Subscriptions',
  'Transportation',
  'Health',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
