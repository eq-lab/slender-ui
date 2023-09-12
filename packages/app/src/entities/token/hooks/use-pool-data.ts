import { useEffect, useState } from 'react'
import { collatCoeff, debtCoeff, getReserve } from '@bindings/pool'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { CONTRACT_MATH_PRECISION, PERCENT_PRECISION } from '../contract-constants'

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

  useEffect(() => {
    ;(async () => {
      const assetArg = {
        asset: tokenAddress,
      }
      const [poolReserve, rawCollateralCoefficient, rawDebtCoefficient] = await Promise.all([
        getReserve(assetArg),
        collatCoeff(assetArg),
        debtCoeff(assetArg),
      ])

      setData({
        borrowInterestRate: poolReserve.borrower_ir,
        lendInterestRate: poolReserve.lender_ir,
        collateralCoefficient: rawCollateralCoefficient.isOk()
          ? rawCollateralCoefficient.unwrap()
          : undefined,
        debtCoefficient: rawDebtCoefficient.isOk() ? rawDebtCoefficient.unwrap() : undefined,
      })
    })()
  }, [tokenAddress])

  return {
    ...data,
    percentMultiplier: PERCENT_PRECISION,
    contractMultiplier: CONTRACT_MATH_PRECISION,
  }
}
