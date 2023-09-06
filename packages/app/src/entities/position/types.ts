import { SupportedToken } from '@/shared/stellar/constants/tokens'

export interface PositionCell {
  type: SupportedToken
  value: number
}

export interface Position {
  stakes: [PositionCell, ...PositionCell[]]
  debts: PositionCell[]
}
