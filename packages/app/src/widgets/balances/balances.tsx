'use client'

import { useGetBalance } from '@/entities/wallet/hooks/use-get-balance/use-get-balance'
import { tokens, XLM_ADDRESS } from '@/shared/stellar/constants/tokens'

export function Balances() {
  const nativeBalance = useGetBalance(XLM_ADDRESS)
  const usdcBalance = useGetBalance(tokens.usdc.address)

  return (
    <>
      <pre>native coin info: {JSON.stringify(nativeBalance, null, 2)}</pre>
      <pre>usdc coin info: {JSON.stringify(usdcBalance, null, 2)}</pre>
    </>
  )
}
