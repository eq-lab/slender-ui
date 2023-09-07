import { SupportedToken } from '@/shared/stellar/constants/tokens'

export interface PositionCell {
  type: SupportedToken
  value: number
}

export interface Position {
  deposits: [PositionCell, ...PositionCell[]]
  debts: PositionCell[]
}
