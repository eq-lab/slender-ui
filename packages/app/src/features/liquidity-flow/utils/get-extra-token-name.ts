import { SupportedToken } from '@/shared/stellar/constants/tokens'

export const getExtraTokenName = (tokenNames: SupportedToken[], tokenName: SupportedToken) =>
  tokenNames[0] === tokenName ? tokenNames[1] : tokenNames[0]
