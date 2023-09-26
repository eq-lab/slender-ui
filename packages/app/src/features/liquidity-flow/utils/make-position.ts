import { PositionCell } from '@/entities/position/types'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'

export function makePosition(
  tokenName: SupportedTokenName,
  rawValue: string,
  decimals: number = 0,
): PositionCell {
  const value = BigInt(Number(rawValue) * 10 ** decimals)
  return { tokenName, value }
}
