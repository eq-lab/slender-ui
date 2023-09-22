export const formatUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
}).format

export const formatCryptoCurrency = new Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
}).format

export const formatPercent = (value: number): string => `${+value.toFixed(1)}%`
