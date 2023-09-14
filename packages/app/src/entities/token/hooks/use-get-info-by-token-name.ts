import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useTokenCache } from '../context/hooks'

export const useGetInfoByTokenName = () => {
  const tokensCache = useTokenCache()
  return (token?: SupportedToken) => token && tokensCache?.[tokenContracts[token].address]
}
