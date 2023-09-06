import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'

export const excludeSupportedTokens = <
  T extends [SupportedToken] | [SupportedToken, SupportedToken],
  R = T['length'] extends 1 ? [SupportedToken, SupportedToken] : [SupportedToken],
>(
  token: T,
): R => SUPPORTED_TOKENS.filter((element) => !token.includes(element)) as R

export const getHealth = ({
  stakeSumUsd,
  debtSumUsd,
  actualDebtUsd,
  actualStakeSumUsd,
}: {
  stakeSumUsd: number
  debtSumUsd: number
  actualDebtUsd: number
  actualStakeSumUsd: number
}) => {
  const defaultHealth = Math.max(Math.round(stakeSumUsd && (1 - debtSumUsd / stakeSumUsd) * 100), 0)

  const health = Math.max(
    Math.round(stakeSumUsd && (1 - actualDebtUsd / (actualStakeSumUsd || 1)) * 100),
    0,
  )

  return { health, healthDelta: health - defaultHealth }
}

export const getBorrowCapacity = ({
  stakeSumUsd,
  debtSumUsd,
  actualDebtUsd,
  actualStakeUsd,
}: {
  stakeSumUsd: number
  debtSumUsd: number
  actualDebtUsd: number
  actualStakeUsd: number
}) => {
  const defaultBorrowCapacity = Math.max(stakeSumUsd - debtSumUsd, 0)
  const borrowCapacity = actualStakeUsd - actualDebtUsd
  const borrowCapacityInterface = Math.max(borrowCapacity, 0)
  const borrowCapacityError = borrowCapacity < 0

  return {
    borrowCapacityDelta: borrowCapacityInterface - defaultBorrowCapacity,
    borrowCapacityError,
    borrowCapacityInterface,
  }
}
