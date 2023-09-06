import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { Position as PositionType } from '@/entities/position/types'

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

export const getStakeUsd = (collateral: PositionType['stakes']) => {
  const sum = collateral.reduce((acc, elem) => {
    if (!elem) return acc
    const { type, value } = elem
    const coinInfo = mockTokenInfoByType[type]
    return acc + value * coinInfo.usd * coinInfo.discount
  }, 0)
  return sum
}

export const getDebtUsd = (debt: PositionType['debts']) => {
  const sum = debt.reduce((acc, elem) => {
    if (!elem) return acc
    const { type, value } = elem
    const coinInfo = mockTokenInfoByType[type]
    return acc + value * coinInfo.usd
  }, 0)
  return sum
}

export const sumObj = <T extends string>(
  obj1: { [K in T]?: number },
  obj2: { [K in T]?: number },
) => {
  const result = {} as { [K in T]?: number }

  Object.entries(obj1).forEach((entry) => {
    const [key, value] = entry as [T, number]
    result[key] = value
    if (key in obj2) {
      result[key] = (result[key] || 0) + (obj2[key] || 0)
    }
  })

  Object.entries(obj2).forEach((entry) => {
    const [key, value] = entry as [T, number]
    if (!(key in obj1)) {
      result[key] = value
    }
  })

  return result
}
