import { SupportedToken } from '@/shared/stellar/constants/tokens'

export interface PositionCell {
  token: SupportedToken
  value: bigint
  valueInUsd?: number
}

export interface Position {
  deposits: PositionCell[]
  debts: PositionCell[]
}
