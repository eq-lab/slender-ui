import { SupportedToken } from '@/shared/stellar/constants/tokens'

export interface PositionCell {
  type: SupportedToken
  value: number
}

export interface Position {
  collaterals: [PositionCell, ...PositionCell[]]
  debts: PositionCell[]
}
