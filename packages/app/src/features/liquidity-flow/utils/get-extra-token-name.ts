import { SupportedTokenName } from '@/shared/stellar/constants/tokens'

export const getExtraTokenName = (
  tokenNames: SupportedTokenName[],
  tokenName: SupportedTokenName,
) => (tokenNames[0] === tokenName ? tokenNames[1] : tokenNames[0])
