import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { logError, logInfo } from '@/shared/logger'
import { borrow } from './binding/borrow'
import { PositionUpdate } from '../types'

const USER_DECLINED_ERROR = 'User declined access'

export async function submitBorrow(
  address: string,
  sendValue: PositionUpdate,
): Promise<'fulfilled' | 'rejected' | 'error'> {
  // we have to sign and send transactions one by one
  // eslint-disable-next-line no-restricted-syntax
  for (const [tokenName, value] of Object.entries(sendValue) as [SupportedToken, bigint][]) {
    try {
      // that's exactly what we want
      // eslint-disable-next-line no-await-in-loop
      const result = await borrow({
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
