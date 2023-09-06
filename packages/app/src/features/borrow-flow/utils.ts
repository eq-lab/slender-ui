import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'

export const excludeSupportedTokens = <
  T extends [SupportedToken] | [SupportedToken, SupportedToken],
  R = T['length'] extends 1 ? [SupportedToken, SupportedToken] : [SupportedToken],
>(
  token: T,
): R => SUPPORTED_TOKENS.filter((element) => !token.includes(element)) as R

export const getHealth = ({
  collateralSumUsd,
  debtSumUsd,
  actualDebtUsd,
}: {
  collateralSumUsd: number
  debtSumUsd: number
  actualDebtUsd: number
}) => {
  const defaultHealth = Math.max(
    Math.round(collateralSumUsd && (1 - debtSumUsd / collateralSumUsd) * 100),
    0,
  )

  const health = Math.max(
    Math.round(collateralSumUsd && (1 - actualDebtUsd / collateralSumUsd) * 100),
    0,
  )

  return { health, healthDelta: health - defaultHealth }
}

export const getBorrowCapacity = ({
  collateralSumUsd,
  debtSumUsd,
  actualDebtUsd,
}: {
  collateralSumUsd: number
  debtSumUsd: number
  actualDebtUsd: number
}) => {
  const defaultBorrowCapacity = Math.max(collateralSumUsd - debtSumUsd, 0)
  const borrowCapacity = collateralSumUsd - actualDebtUsd
  const borrowCapacityInterface = Math.max(borrowCapacity, 0)
  const borrowCapacityError = borrowCapacity < 0

  return {
    borrowCapacityDelta: borrowCapacityInterface - defaultBorrowCapacity,
    borrowCapacityError,
    borrowCapacityInterface,
  }
}
