import { SupportedToken } from '@/shared/stellar/constants/tokens'

export interface PositionCell {
  tokenName: SupportedToken
  value: bigint
  valueInUsd?: number
}

export interface Position {
  deposits: PositionCell[]
  debts: PositionCell[]
}
