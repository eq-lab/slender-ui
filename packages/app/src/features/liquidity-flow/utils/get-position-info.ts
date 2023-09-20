export interface PositionInput {
  depositUsd: number
  debtUsd: number
  actualDebtUsd: number
  actualDepositUsd: number
}

export const getHealth = ({
  depositUsd,
  debtUsd,
  actualDebtUsd,
  actualDepositUsd,
}: PositionInput) => {
  const defaultHealth = Math.max(Math.round(depositUsd && (1 - debtUsd / depositUsd) * 100), 0)

  const health = Math.max(
    Math.round(depositUsd && (1 - actualDebtUsd / (actualDepositUsd || 1)) * 100),
    0,
  )

  return { health, healthDelta: health - defaultHealth }
}

export const getBorrowCapacity = ({
  depositUsd,
  debtUsd,
  actualDebtUsd,
  actualDepositUsd,
}: PositionInput) => {
  const defaultBorrowCapacity = Math.max(depositUsd - debtUsd, 0)
  const borrowCapacity = actualDepositUsd - actualDebtUsd
  const borrowCapacityInterface = Math.max(borrowCapacity, 0)
  const borrowCapacityError = borrowCapacity < 0

  return {
    borrowCapacityDelta: borrowCapacityInterface - defaultBorrowCapacity,
    defaultBorrowCapacity,
    borrowCapacityError,
    borrowCapacityInterface,
  }
}

export const getPositionInfo = (positionInput: PositionInput) => {
  const heathInfo = getHealth(positionInput)
  const borrowCapacityInfo = getBorrowCapacity(positionInput)
  return { ...heathInfo, ...borrowCapacityInfo }
}
