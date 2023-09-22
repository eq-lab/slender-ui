import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useMarketData } from '@/entities/token/context/hooks'
import { usePriceInUsd } from '@/entities/currency-rates/context/hooks'
import { getDecimalDiscount } from '../../../shared/utils/get-decimal-discount'

export function useTokenInfo(tokenName?: SupportedToken): {
  userBalance: number
  discount: number
  priceInUsd: number
} {
  const marketData = useMarketData()
  const priceInUsdList = usePriceInUsd()
  const address = tokenName && tokenContracts[tokenName].address
  const [balance] = useGetBalance(address ? [address] : [])

  if (tokenName && address) {
    const { discount = 0 } = marketData?.[address] ?? {}
    const priceInUsd = priceInUsdList?.[tokenName] ?? 0
    const decimals = balance?.decimals || 0
    const userBalance = Number(balance?.balance ?? 0) / 10 ** decimals

    return {
      discount: getDecimalDiscount(discount),
      priceInUsd,
      userBalance,
    }
  }

  return {
    discount: 0,
    priceInUsd: 0,
    userBalance: 0,
  }
}
