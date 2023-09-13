import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useTokenCache } from '@/entities/token/context/hooks'

export const useGetSymbolByToken = () => {
  const tokensCache = useTokenCache()
  return (token?: SupportedToken) => token && tokensCache?.[tokenContracts[token].address]?.symbol
}
