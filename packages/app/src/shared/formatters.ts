export const formatUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format

export const formatCryptoCurrency = new Intl.NumberFormat('en-US').format

export const formatCompactUsd = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
}).format

export const formatCompactCryptoCurrency = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
}).format

export const formatPercent = (value: number): string => `${+value.toFixed(1)}%`
