import { SupportedToken, tokens } from '@/shared/stellar/constants/tokens'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useMarketData } from '@/entities/token/context/hooks'
import { usePriceInUsd } from '@/entities/currency-rates/context/hooks'

export function useTokenInfo(token: SupportedToken): {
  userBalance: number
  discount: number
  priceInUsd: number
} {
  const { address } = tokens[token]
  const marketData = useMarketData()
  const { discount = 0 } = marketData?.[address] ?? {}
  const priceInUsd = usePriceInUsd()[token]
  const [balance] = useGetBalance([address])
  const decimals = balance?.decimals || 0
  const userBalance = Number(balance?.balance ?? 0) / 10 ** decimals

  return {
    discount,
    priceInUsd,
    userBalance,
  }
}
