import { useEffect, useState } from 'react'
import { networks, i128, ReserveData } from '@bindings/pool'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { scValToJs } from '@/shared/stellar/decoders'
import { addressToScVal } from '@/shared/stellar/encoders'
import { CONTRACT_MATH_PRECISION, PERCENT_PRECISION } from '../constants/contract-constants'

type PoolData = {
  borrowInterestRate?: bigint
  lendInterestRate?: bigint
  collateralCoefficient?: bigint
  debtCoefficient?: bigint
}

export function usePoolData(tokenAddress: TokenAddress): PoolData & {
  percentMultiplier: number
  contractMultiplier: number
} {
  const [data, setData] = useState<PoolData>({})
  const makeInvoke = useMakeInvoke()

  useEffect(() => {
    ;(async () => {
      const invoke = makeInvoke(networks.futurenet.contractId)
      const assetArg = [addressToScVal(tokenAddress)]
      const [poolReserve, collateralCoefficient, debtCoefficient] = await Promise.all([
        invoke<ReserveData>('get_reserve', scValToJs, assetArg),
        invoke<i128>('collat_coeff', scValToJs, assetArg),
        invoke<i128>('debt_coeff', scValToJs, assetArg),
      ])

      setData({
        borrowInterestRate: poolReserve.borrower_ir,
        lendInterestRate: poolReserve.lender_ir,
        collateralCoefficient,
        debtCoefficient,
      })
    })()
  }, [tokenAddress])

  return {
    ...data,
    percentMultiplier: PERCENT_PRECISION,
    contractMultiplier: CONTRACT_MATH_PRECISION,
  }
}
