import { SupportedTokenName } from '@/shared/stellar/constants/tokens'

export interface PositionCell {
  tokenName: SupportedTokenName
  value: bigint
  valueInUsd?: number
}

export interface Position {
  deposits: PositionCell[]
  debts: PositionCell[]
}
