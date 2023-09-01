import * as SorobanClient from 'soroban-client'
import { useEffect, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { FUTURENET_NETWORK_DETAILS } from '@/shared/stellar/constants/networks'
import { useMakeGetTx } from '@/shared/stellar/hooks/invoke'
import { WalletContext } from '../../context/context'
import { accountIdentifier, decodeStr, decodeU32, decodei128 } from './decoders'

interface SorobanTokenRecord {
  [key: string]: unknown
  balance: number
  name: string
  symbol: string
  decimals: string
}

type TxToOp = {
  [index: string]: {
    tx: SorobanClient.Transaction<
      SorobanClient.Memo<SorobanClient.MemoType>,
      SorobanClient.Operation[]
    >
    decoder: (xdr: string) => string | number
  }
}

const server = new SorobanClient.Server(FUTURENET_NETWORK_DETAILS.rpcUrl, {
  allowHttp: FUTURENET_NETWORK_DETAILS.networkUrl.startsWith('http://'),
})

export const useGetBalance = (tokenAddress: string) => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord | null>(null)
  const userAddress = useContextSelector(WalletContext, (state) => state.address)
  const getTx = useMakeGetTx(tokenAddress)

  useEffect(() => {
    if (!userAddress) {
      setBalanceInfo(null)
      return
    }

    const balanceTxParams = [accountIdentifier(userAddress)]
    const balanceTx = getTx('balance', balanceTxParams)
    const nameTx = getTx('name')
    const symbolTx = getTx('symbol')
    const decimalsTx = getTx('decimals')

    const txs: TxToOp = {
      balance: {
        tx: balanceTx,
        decoder: decodei128,
      },
      name: {
        tx: nameTx,
        decoder: decodeStr,
      },
      symbol: {
        tx: symbolTx,
        decoder: decodeStr,
      },
      decimals: {
        tx: decimalsTx,
        decoder: decodeU32,
      },
    }

    const tokenBalanceInfo = Object.keys(txs).reduce(
      async (prev, curr) => {
        const prevResult = await prev
        const current = txs[curr]
        if (!current) {
          return prevResult
        }
        const { tx, decoder } = current
        const { results } = await server.simulateTransaction(tx)
        if (!results) {
          return prevResult
        }
        const [result] = results
        if (!result) {
          return prevResult
        }
        prevResult[curr] = decoder(result.xdr)
        return prevResult
      },
      Promise.resolve({} as SorobanTokenRecord),
    )

    tokenBalanceInfo.then((balance) => setBalanceInfo(balance))
  }, [getTx, tokenAddress, userAddress])

  return balanceInfo
}
