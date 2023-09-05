import { useEffect, useState } from 'react'
import { getReserve, collatCoeff } from '@bindings/pool'
import { useMakeInvoke } from '@/shared/stellar/hooks/invoke'
import { decodei128 } from '@/shared/stellar/decoders'
import { logInfo } from '@/shared/logger'

const PERCENT_PRECISION = 1e4

type PoolData = {
  borrowInterestRate?: bigint
  lendInterestRate?: bigint
  discount?: number
  liquidationPenalty?: number
  collateralCoefficient?: number
}

const withDefaultCatch = <T, D>(promise: Promise<T>, defaultValue: D): Promise<T | D> =>
  new Promise<T | D>((resolve) => {
    promise.then(resolve).catch((e) => {
      logInfo('Replaced with a default value because of', e)
      resolve(defaultValue)
    })
  })

export function usePoolData(
  tokenAddress: string,
  sTokenAddress: string,
): PoolData & {
  percentMultiplier: number
} {
  const [data, setData] = useState<PoolData>({})
  const makeInvoke = useMakeInvoke()
  const invokeSToken = makeInvoke(sTokenAddress)

  useEffect(() => {
    ;(async () => {
      const assetArg = {
        asset: tokenAddress,
      }
      const [poolResponse, totalSupply, rawCollateralCoefficient] = await Promise.all([
        getReserve(assetArg),
        invokeSToken('total_supply', decodei128),
        withDefaultCatch(collatCoeff(assetArg), { value: 0 }),
      ])

      setData({
        borrowInterestRate: poolResponse.borrower_ir,
        lendInterestRate: poolResponse.lender_ir,
        // @ts-ignore
        discount: poolResponse.configuration.get('discount'),
        // @ts-ignore
        liquidationPenalty: poolResponse.configuration.get('liq_bonus') - PERCENT_PRECISION,
        totalSupply,
        // @ts-ignore
        collateralCoefficient: String(rawCollateralCoefficient.value),
      })
    })()
  }, [tokenAddress, invokeSToken])

  return {
    ...data,
    percentMultiplier: PERCENT_PRECISION,
  }
}
