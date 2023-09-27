import { PositionCell } from '@/entities/position/types'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import BigNumber from 'bignumber.js'

export function makePosition(tokenName: SupportedTokenName, rawValue: string): PositionCell {
  return { tokenName, value: BigNumber(rawValue) }
}
