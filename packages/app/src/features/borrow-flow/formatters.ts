export const formatUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format
