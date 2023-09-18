import { SupportedToken, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'

export const excludeSupportedTokens = (token: SupportedToken[]): SupportedToken[] =>
  SUPPORTED_TOKENS.filter((element) => !token.includes(element)) as SupportedToken[]
