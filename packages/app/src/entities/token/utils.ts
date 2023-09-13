export const makeFormatPercentWithPrecision =
  (multiplier: number) =>
  (value?: number | bigint): string =>
    value === undefined ? '...' : `${+Number((Number(value) * 100) / multiplier).toFixed(1)}%`
