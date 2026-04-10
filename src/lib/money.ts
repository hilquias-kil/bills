/**
 * Money helpers for Brazilian locale (pt-BR).
 *
 * - Display: uses comma as decimal separator and dot as thousands separator.
 * - Input: we keep a user-editable string, but sanitize to comma decimals and parse robustly.
 */

export function formatBRL(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(safe);
  } catch {
    // Fallback: "R$ 1.234,56" (approx), without Intl.
    const fixed = safe.toFixed(2);
    const [intPartRaw, decPart] = fixed.split('.');
    const intWithGrouping = intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${intWithGrouping},${decPart}`;
  }
}

export function formatDecimalBR(
  value: number,
  opts?: { minimumFractionDigits?: number; maximumFractionDigits?: number; useGrouping?: boolean }
): string {
  const safe = Number.isFinite(value) ? value : 0;
  const minimumFractionDigits = opts?.minimumFractionDigits ?? 2;
  const maximumFractionDigits = opts?.maximumFractionDigits ?? 2;
  const useGrouping = opts?.useGrouping ?? false;
  try {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
    }).format(safe);
  } catch {
    const fixed = safe.toFixed(Math.max(minimumFractionDigits, maximumFractionDigits));
    return fixed.replace('.', ',');
  }
}

/**
 * Sanitizes user input into a "pt-BR-ish" decimal string.
 */
export function sanitizeBRLInput(text: string): string {
  let s = (text ?? '')
    .replace(/\s+/g, '')
    .replace(/R\$/gi, '')
    .replace(/[^\d,.\-]/g, '');

  // allow '-' only at the start
  s = s.replace(/(?!^)-/g, '');

  if (!s) return '';

  if (s.includes(',')) {
    const [intPart, ...rest] = s.split(',');
    const decPart = rest.join('');
    const intClean = intPart.replace(/\./g, '');
    return decPart.length ? `${intClean},${decPart}` : `${intClean},`;
  }

  if (s.includes('.')) {
    const parts = s.split('.');
    const decPart = parts.pop() ?? '';
    const intPart = parts.join('').replace(/\./g, '');
    return decPart.length ? `${intPart},${decPart}` : `${intPart},`;
  }

  return s;
}

/**
 * Parses a decimal string that may contain Brazilian formatting.
 */
export function parseDecimalBR(text: string): number {
  const raw = (text ?? '').trim();
  if (!raw) return NaN;

  const cleaned = raw
    .replace(/\s+/g, '')
    .replace(/R\$/gi, '')
    .replace(/[^\d,.\-]/g, '')
    .replace(/(?!^)-/g, '');

  if (!cleaned) return NaN;

  if (cleaned.includes(',')) {
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : NaN;
  }

  const dotParts = cleaned.split('.');
  let normalized = cleaned;
  if (dotParts.length > 2) {
    const last = dotParts.pop()!;
    normalized = `${dotParts.join('')}.${last}`;
  }

  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}
