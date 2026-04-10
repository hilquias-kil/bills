const STORAGE_KEYS = {
  BILLS: 'bills-pwa:bills',
  PAYMENTS: 'bills-pwa:payments',
  LAST_RESET_MONTH: 'bills-pwa:lastResetMonth',
} as const;

export async function getStoredBills<T>(): Promise<T[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BILLS);
    return data ? (JSON.parse(data) as T[]) : [];
  } catch {
    return [];
  }
}

export async function setStoredBills<T>(bills: T[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  } catch (error) {
    console.error('Error saving bills:', error);
  }
}

export async function getStoredPayments<T>(): Promise<T[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return data ? (JSON.parse(data) as T[]) : [];
  } catch {
    return [];
  }
}

export async function setStoredPayments<T>(payments: T[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  } catch (error) {
    console.error('Error saving payments:', error);
  }
}

export async function getLastResetMonth(): Promise<string | null> {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_RESET_MONTH);
  } catch {
    return null;
  }
}

export async function setLastResetMonth(monthYear: string): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_RESET_MONTH, monthYear);
  } catch (error) {
    console.error('Error saving last reset month:', error);
  }
}

export function getCurrentMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
