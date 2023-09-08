import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { Position as PositionType } from '@/entities/position/types'

export const excludeSupportedTokens = (token: SupportedToken[]): SupportedToken[] =>
  SUPPORTED_TOKENS.filter((element) => !token.includes(element)) as SupportedToken[]

interface PositionInput {
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
