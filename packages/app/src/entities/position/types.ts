import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import BigNumber from 'bignumber.js'

export interface PositionCell {
  tokenName: SupportedTokenName
  value: BigNumber
  valueInUsd?: number
}

export interface Position {
  deposits: PositionCell[]
  debts: PositionCell[]
}
