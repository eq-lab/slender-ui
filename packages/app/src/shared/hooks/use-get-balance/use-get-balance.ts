import * as SorobanClient from 'soroban-client'
import { useEffect, useState } from 'react'
import { useContextSelector } from 'use-context-selector'
import { WalletContext } from '@/entities/wallet/context/context'
import { FUTURENET_NETWORK_DETAILS, SOROBAN_RPC_URLS } from '../../constants/networks'
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

const server = new SorobanClient.Server(SOROBAN_RPC_URLS.FUTURENET, {
  allowHttp: FUTURENET_NETWORK_DETAILS.networkUrl.startsWith('http://'),
})

const FEE = '100'
const ACCOUNT_SEQUENCE = '0'

export const useGetBalance = (address: string) => {
  const [balanceInfo, setBalanceInfo] = useState<SorobanTokenRecord | null>(null)
  const publicKey = useContextSelector(WalletContext, (state) => state.address)

  useEffect(() => {
    if (!publicKey) {
      setBalanceInfo(null)
      return
    }

    const contract = new SorobanClient.Contract(address)
    const source = new SorobanClient.Account(publicKey, ACCOUNT_SEQUENCE)
    const balanceTxParams = [accountIdentifier(publicKey)]

    const newTxBuilder = () =>
      new SorobanClient.TransactionBuilder(source, {
        fee: FEE,
        networkPassphrase: FUTURENET_NETWORK_DETAILS.networkPassphrase,
      })

    const balanceTx = newTxBuilder()
      .addOperation(contract.call('balance', ...balanceTxParams))
      .setTimeout(SorobanClient.TimeoutInfinite)
      .build()

    const nameTx = newTxBuilder()
      .addOperation(contract.call('name'))
      .setTimeout(SorobanClient.TimeoutInfinite)
      .build()

    const symbolTx = newTxBuilder()
      .addOperation(contract.call('symbol'))
      .setTimeout(SorobanClient.TimeoutInfinite)
      .build()

    const decimalsTx = newTxBuilder()
      .addOperation(contract.call('decimals'))
      .setTimeout(SorobanClient.TimeoutInfinite)
      .build()

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
  }, [address, publicKey])

  return balanceInfo
}
