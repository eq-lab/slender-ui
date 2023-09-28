import React from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'

export interface AssetsInfo {
  tokenName: SupportedTokenName
  title: string
  symbol: string
  Icon: React.FC<React.SVGProps<SVGSVGElement>>
  tokenBalance: number
}

export function useGetAssetsInfo(
  tokenNames: SupportedTokenName[],
  isDeposit?: boolean,
): AssetsInfo[] {
  const getTokenByTokenName = useGetTokenByTokenName()
  const depositBalances = useGetBalance(
    tokenNames.map((tokenName) => tokenContracts[tokenName].address),
  )

  const assetsInfo: AssetsInfo[] = tokenNames.reduce(
    (tokens: AssetsInfo[], currentToken, index) => {
      const token = getTokenByTokenName(currentToken)
      const tokenBalance = depositBalances[index]?.balance.toNumber() || 0
      if (!token || (!tokenBalance && isDeposit)) return tokens
      const { title, symbol } = token
      const Icon = getIconByTokenName(currentToken)
      tokens.push({
        tokenName: currentToken,
        title,
        symbol,
        Icon,
        tokenBalance,
      })
      return tokens
    },
    [],
  )

  return assetsInfo
}
