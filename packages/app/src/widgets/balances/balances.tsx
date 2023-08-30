'use client'

import { useGetBalance } from '@/entities/wallet/hooks/use-get-balance/use-get-balance'
import { tokens } from '@/shared/stellar-constants/tokens'

export function Balances() {
  const usdcBalance = useGetBalance(tokens.usdc.address)

  return <pre>usdc coin info: {JSON.stringify(usdcBalance, null, 2)}</pre>
}
