import * as SorobanClient from 'soroban-client'
import { useEffect, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { invoke, useMakeGetTx } from '@/shared/stellar/hooks/invoke'
import { decodeStr, decodeU32, decodei128 } from '@/shared/stellar/decoders'
import { WalletContext } from '../../context/context'

interface SorobanTokenRecord {
  [key: string]: unknown
  balance: string
  name: string
  symbol: string
  decimals: number
}

const accountIdentifier = (account: string) => new SorobanClient.Address(account).toScVal()

export const useGetBalance = (tokenAddress: string) => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord | null>()
  const userAddress = useContextSelector(WalletContext, (state) => state.address)
  const makeGetTx = useMakeGetTx()

  useEffect(() => {
    if (!userAddress) {
      setBalanceInfo(null)
      return
    }

    const getTx = makeGetTx(tokenAddress)
    const balanceTxParams = [accountIdentifier(userAddress)]
    const balanceTx = getTx('balance', balanceTxParams)
    const nameTx = getTx('name')
    const symbolTx = getTx('symbol')
    const decimalsTx = getTx('decimals')

    Promise.all([
      invoke(balanceTx, decodei128),
      invoke(nameTx, decodeStr),
      invoke(symbolTx, decodeStr),
      invoke(decimalsTx, decodeU32),
    ]).then(([balance, name, symbol, decimals]) => {
      setBalanceInfo({ balance, name, symbol, decimals })
    })
  }, [makeGetTx, tokenAddress, userAddress])

  return balanceInfo
}
