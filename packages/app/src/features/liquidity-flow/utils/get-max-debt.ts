export const getMaxDebt = (
  availableToBorrow: number,
  defaultBorrowCapacity: number,
  priceInUsd: number,
) => Math.min(availableToBorrow, Number((defaultBorrowCapacity * priceInUsd).toFixed(3)));
