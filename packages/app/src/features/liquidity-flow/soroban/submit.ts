import { PositionUpdate } from '@/features/liquidity-flow/types'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { logInfo } from '@/shared/logger'
import { makeLiquidityBinding } from './binding/make-liquidity-binding'

const USER_DECLINED_ERROR = 'User declined access'

const makeSubmit =
  (methodName: Parameters<typeof makeLiquidityBinding>[0]) =>
  async (address: string, sendValue: PositionUpdate): Promise<'fulfilled' | never> => {
    // we have to sign and send transactions one by one
    // eslint-disable-next-line no-restricted-syntax
    for (const [tokenName, value] of Object.entries(sendValue) as [SupportedToken, bigint][]) {
      try {
        // that's exactly what we want
        // eslint-disable-next-line no-await-in-loop
        const result = await makeLiquidityBinding(methodName)({
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

export const submitBorrow = makeSubmit('borrow')
export const submitDeposit = makeSubmit('deposit')
export const submitRepay = makeSubmit('repay')
