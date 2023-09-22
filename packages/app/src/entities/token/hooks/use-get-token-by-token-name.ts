import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useTokenCache } from '../context/hooks'
import { TokenCache } from '../context/context'

export const useGetTokenByTokenName = () => {
  const tokensCache = useTokenCache()
  return (token?: SupportedTokenName): TokenCache | undefined =>
    token && tokensCache?.[tokenContracts[token].address]
}
