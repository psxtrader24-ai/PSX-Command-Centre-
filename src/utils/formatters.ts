/**
 * Financial formatters for PSX Portfolio & Trading Terminal
 */

export function formatPKR(
  val: number | undefined | null,
  options: {
    compact?: boolean;
    showSign?: boolean;
    decimals?: number;
    prefix?: string;
  } = {}
): string {
  if (val === undefined || val === null || isNaN(val)) return 'Rs 0.00';
  
  const prefix = options.prefix !== undefined ? options.prefix : 'Rs ';
  const sign = options.showSign && val > 0 ? '+' : '';
  const decimals = options.decimals !== undefined ? options.decimals : 2;

  if (options.compact) {
    const abs = Math.abs(val);
    let formatted = '';
    if (abs >= 10000000) {
      formatted = (val / 10000000).toFixed(2) + ' Cr'; // 1 Crore = 10 Million in Pakistan
    } else if (abs >= 1000000) {
      formatted = (val / 1000000).toFixed(2) + ' M';
    } else if (abs >= 100000) {
      formatted = (val / 100000).toFixed(2) + ' Lac'; // 1 Lac = 100,000 in Pakistan
    } else if (abs >= 1000) {
      formatted = (val / 1000).toFixed(1) + ' k';
    } else {
      formatted = val.toFixed(decimals);
    }
    return `${sign}${prefix}${formatted}`;
  }

  const parts = val.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${prefix}${parts.join('.')}`;
}

export function formatPercent(
  val: number | undefined | null,
  options: { showSign?: boolean; decimals?: number } = {}
): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const showSign = options.showSign ?? true;
  const decimals = options.decimals ?? 2;
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(decimals)}%`;
}

export function formatR(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '—';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}R`;
}

export function formatNumber(val: number | undefined | null, decimals: number = 0): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  const parts = val.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
