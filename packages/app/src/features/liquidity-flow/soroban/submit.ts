import { networks, MintBurn } from '@bindings/pool'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { logInfo } from '@/shared/logger'
import { addressToScVal, bigintToScVal } from '@/shared/stellar/encoders'
import { useMakeInvoke } from '@/shared/stellar/hooks/use-make-invoke'
import { SorobanRpc } from 'soroban-client'
import { PositionUpdate } from '../types'

const USER_DECLINED_ERROR = 'User declined access'
export type PoolMethodName = 'borrow' | 'deposit' | 'repay' | 'withdraw'
const WITH_TO: PoolMethodName = 'withdraw'

export const useSubmit = (methodName: PoolMethodName) => {
  const makeInvoke = useMakeInvoke()
  const invoke = makeInvoke(networks.futurenet.contractId)
  const runLiquidityBinding = async ({
    who,
    asset,
    amount,
  }: {
    who: string
    asset: string
    amount: bigint
  }) =>
    invoke<Array<MintBurn> | SorobanRpc.SendTransactionStatus | SorobanRpc.GetTransactionStatus>(
      methodName,
      [
        addressToScVal(who),
        addressToScVal(asset),
        bigintToScVal(amount),
        ...(methodName === WITH_TO ? [addressToScVal(who)] : []),
      ],
    )

  return async (address: string, sendValue: PositionUpdate): Promise<'fulfilled' | never> => {
    // we have to sign and send transactions one by one
    // eslint-disable-next-line no-restricted-syntax
    for (const [tokenName, value] of Object.entries(sendValue) as [SupportedTokenName, bigint][]) {
      try {
        // that's exactly what we want
        // eslint-disable-next-line no-await-in-loop
        const result = await runLiquidityBinding({
          who: address,
          asset: tokenContracts[tokenName].address,
          amount: value,
        })
        logInfo('Tx result:', result)
      } catch (e) {
        if (e === USER_DECLINED_ERROR) {
          throw Error('rejected')
        }
        throw e
      }
    }
    return 'fulfilled'
  }
}
