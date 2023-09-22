import { SupportedTokenName, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'

export const excludeSupportedTokens = (
  token: SupportedTokenName[],
  tokens?: SupportedTokenName[],
): SupportedTokenName[] =>
  (tokens || SUPPORTED_TOKENS).filter((element) => !token.includes(element)) as SupportedTokenName[]
