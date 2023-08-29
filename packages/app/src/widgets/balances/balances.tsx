'use client'

import { useGetBalance } from '@/entities/wallet/hooks/use-get-balance/use-get-balance'

const USDC_ADDRESS = 'CDZI6HFGUFB7XJWXLOWW6MUQQ6YX3NPA36ADTYNMRRX7H5YG7GK7I7SU'

export function Balances() {
  const usdcBalance = useGetBalance(USDC_ADDRESS)

  return <pre>usdc coin info: {JSON.stringify(usdcBalance, null, 2)}</pre>
}
