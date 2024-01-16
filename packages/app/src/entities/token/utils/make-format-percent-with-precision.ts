import { formatPercent } from '@/shared/formatters';

export const makeFormatPercentWithPrecision =
  (multiplier: number) =>
  (value?: number | bigint): string =>
    value === undefined ? '...' : formatPercent(+Number((Number(value) * 100) / multiplier));
