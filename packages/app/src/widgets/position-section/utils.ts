import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { Position as PositionType } from '@/entities/position/types'

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

export const getCollateralUsd = (collateral: PositionType['collaterals']) => {
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
