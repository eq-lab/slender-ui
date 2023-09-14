import { PositionUpdate } from '@/features/borrow-flow/types'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { logError, logInfo } from '@/shared/logger'
import { borrow } from './binding/borrow'
import { deposit } from './binding/deposit'

const USER_DECLINED_ERROR = 'User declined access'

const makeSubmit =
  (submitFunction: typeof borrow) =>
  async (
    address: string,
    sendValue: PositionUpdate,
  ): Promise<'fulfilled' | 'rejected' | 'error'> => {
    // we have to sign and send transactions one by one
    // eslint-disable-next-line no-restricted-syntax
    for (const [tokenName, value] of Object.entries(sendValue) as [SupportedToken, bigint][]) {
      try {
        // that's exactly what we want
        // eslint-disable-next-line no-await-in-loop
        const result = await submitFunction({
          who: address,
          asset: tokenContracts[tokenName].address,
          amount: value,
        })
        logInfo('Tx result:', result)
      } catch (e) {
        if (e === USER_DECLINED_ERROR) {
          return 'rejected'
        }
        logError(e)
        return 'error'
      }
    }
    return 'fulfilled'
  }

export const submitBorrow = makeSubmit(borrow)
export const submitDeposit = makeSubmit(deposit)
