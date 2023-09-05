import { useEffect, useState } from 'react'
import { getReserve, collatCoeff, debtCoeff } from '@bindings/pool'

const PERCENT_PRECISION = 1e4

type PoolData = {
  borrowInterestRate?: bigint
  lendInterestRate?: bigint
  discount?: number
  liquidationPenalty?: number
  utilizationCapacity?: number
  collateralCoefficient?: bigint
  debtCoefficient?: bigint
}

export function usePoolData(tokenAddress: string): PoolData & {
  percentMultiplier: number
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
        // @ts-ignore
        discount: poolReserve.configuration.get('discount'),
        // @ts-ignore
        liquidationPenalty: poolReserve.configuration.get('liq_bonus') - PERCENT_PRECISION,
        // @ts-ignore
        utilizationCapacity: poolReserve.configuration.get('util_cap'),
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
  }
}
