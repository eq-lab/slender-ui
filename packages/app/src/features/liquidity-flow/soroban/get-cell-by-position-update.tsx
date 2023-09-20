import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { PositionUpdate } from '../types'

export const getCellByPositionUpdate = (update: PositionUpdate): PositionCell[] =>
  Object.entries(update).map(([tokenName, value]) => ({
    tokenName: tokenName as SupportedToken,
    value,
  }))
