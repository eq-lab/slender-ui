export const getMaxDebt = (
  availableToBorrow: number,
  defaultBorrowCapacity: number,
  priceInUsd: number,
) => Math.min(availableToBorrow, Math.floor(defaultBorrowCapacity / priceInUsd))
