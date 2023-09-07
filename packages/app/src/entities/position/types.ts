import { SupportedToken } from '@/shared/stellar/constants/tokens'

export interface PositionCell {
  token: SupportedToken
  value: number
}

export interface Position {
  deposits: [PositionCell, ...PositionCell[]]
  debts: PositionCell[]
}
