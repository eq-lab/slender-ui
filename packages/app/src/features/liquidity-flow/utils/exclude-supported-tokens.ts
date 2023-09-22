import { SupportedToken, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'

export const excludeSupportedTokens = (
  token: SupportedToken[],
  tokens?: SupportedToken[],
): SupportedToken[] =>
  (tokens || SUPPORTED_TOKENS).filter((element) => !token.includes(element)) as SupportedToken[]
