import { SupportedTokenName, SUPPORTED_TOKEN_NAMES } from '@/shared/stellar/constants/tokens';

export const excludeSupportedTokens = (
  token: SupportedTokenName[],
  tokens?: SupportedTokenName[],
): SupportedTokenName[] =>
  (tokens || SUPPORTED_TOKEN_NAMES).filter(
    (element) => !token.includes(element),
  ) as SupportedTokenName[];
