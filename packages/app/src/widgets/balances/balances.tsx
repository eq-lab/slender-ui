'use client'

import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { tokens } from '@/shared/stellar/constants/tokens'
import { useContextSelector } from 'use-context-selector'
import { WalletContext } from '@/entities/wallet/context/context'

export function Balances() {
  const userAddress = useContextSelector(WalletContext, (state) => state.address)
  const nativeBalance = useGetBalance([tokens.xlm.address], userAddress)?.[0]
  const usdcBalance = useGetBalance([tokens.usdc.address], userAddress)?.[0]

  return (
    <>
      <pre>native coin info: {JSON.stringify(nativeBalance, null, 2)}</pre>
      <pre>usdc coin info: {JSON.stringify(usdcBalance, null, 2)}</pre>
    </>
  )
}
