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
  depositSumUsd,
  debtSumUsd,
  actualDebtUsd,
  actualDepositSumUsd,
}: {
  depositSumUsd: number
  debtSumUsd: number
  actualDebtUsd: number
  actualDepositSumUsd: number
}) => {
  const defaultHealth = Math.max(
    Math.round(depositSumUsd && (1 - debtSumUsd / depositSumUsd) * 100),
    0,
  )

  const health = Math.max(
    Math.round(depositSumUsd && (1 - actualDebtUsd / (actualDepositSumUsd || 1)) * 100),
    0,
  )

  return { health, healthDelta: health - defaultHealth }
}

export const getBorrowCapacity = ({
  depositSumUsd,
  debtSumUsd,
  actualDebtUsd,
  actualDepositUsd,
}: {
  depositSumUsd: number
  debtSumUsd: number
  actualDebtUsd: number
  actualDepositUsd: number
}) => {
  const defaultBorrowCapacity = Math.max(depositSumUsd - debtSumUsd, 0)
  const borrowCapacity = actualDepositUsd - actualDebtUsd
  const borrowCapacityInterface = Math.max(borrowCapacity, 0)
  const borrowCapacityError = borrowCapacity < 0

  return {
    borrowCapacityDelta: borrowCapacityInterface - defaultBorrowCapacity,
    borrowCapacityError,
    borrowCapacityInterface,
  }
}

export const getDepositUsd = (collateral: PositionType['deposits']) =>
  collateral.reduce((acc, elem) => {
    if (!elem) return acc
    const { token, value } = elem
    const coinInfo = mockTokenInfoByType[token]
    return acc + value * coinInfo.usd * coinInfo.discount
  }, 0)

export const getDebtUsd = (debt: PositionType['debts']) =>
  debt.reduce((acc, elem) => {
    if (!elem) return acc
    const { token, value } = elem
    const coinInfo = mockTokenInfoByType[token]
    return acc + value * coinInfo.usd
  }, 0)

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
