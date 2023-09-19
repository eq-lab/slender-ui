import { useEffect, useState } from 'react'
import { Contract, networks, Address } from '@bindings/pool'
import { TokenAddress } from '@/shared/stellar/constants/tokens'
import { FUTURENET_NETWORK_DETAILS } from '@/shared/stellar/constants/networks'
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

  useEffect(() => {
    ;(async () => {
      const contract = new Contract({
        ...networks.futurenet,
        rpcUrl: FUTURENET_NETWORK_DETAILS.rpcUrl,
      })
      const assetArg = {
        asset: Address.fromString(tokenAddress),
      }
      const [poolReserve, rawCollateralCoefficient, rawDebtCoefficient] = await Promise.all([
        contract.getReserve(assetArg),
        contract.collatCoeff(assetArg),
        contract.debtCoeff(assetArg),
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
