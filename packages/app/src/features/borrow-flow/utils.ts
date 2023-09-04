import { SUPPORTED_TOKENS, SupportedToken } from '@/shared/stellar/constants/tokens'

export const excludeSupportedTokens = <
  T extends [SupportedToken] | [SupportedToken, SupportedToken],
  R = T['length'] extends 1 ? [SupportedToken, SupportedToken] : [SupportedToken],
>(
  token: T,
): R => SUPPORTED_TOKENS.filter((element) => !token.includes(element)) as R
