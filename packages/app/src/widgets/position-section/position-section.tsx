'use client'

import React, { useMemo, useEffect } from 'react'
import { tokens, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import { useGetBalance, SorobanTokenRecord } from '@/entities/token/hooks/use-get-balance'
import { WalletContext } from '@/entities/wallet/context/context'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'
import {
  useGetCryptocurrencyUsdRates,
  SupportedTokenRates,
} from '@/entities/currency-rates/hooks/use-get-cryptocurrency-usd-rates'
import { useLendIncrease } from '@/features/borrow-flow/hooks/use-lend-increase'

const sorobanTokenRecordToPositionCell = (
  tokenRecord: SorobanTokenRecord,
  cryptocurrencyUsdRates?: SupportedTokenRates,
): PositionCellType => {
  const value = Number(tokenRecord.balance) / 10 ** tokenRecord.decimals
  const token = tokenRecord.symbol.substring(1).toLowerCase() as PositionCellType['token']
  const usdRate = cryptocurrencyUsdRates?.[token]

  return {
    value: Number(tokenRecord.balance) / 10 ** tokenRecord.decimals,
    valueInUsd: usdRate && value * usdRate,
    token,
  }
}

export function PositionSection() {
  const userAddress = useContextSelector(WalletContext, (state) => state.address)
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const cryptocurrencyUsdRates = useGetCryptocurrencyUsdRates()
  const debtSupportedTokensArray = useMemo(
    () => SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].debtAddress),
    [],
  )
  const lendSupportedTokensArray = useMemo(
    () => SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].sAddress),
    [],
  )

  const debtBalances = useGetBalance(debtSupportedTokensArray, userAddress)
  const lendBalances = useGetBalance(lendSupportedTokensArray, userAddress)

  useEffect(() => {
    const debtPositions = debtBalances?.reduce((resultArr: PositionCellType[], currentItem) => {
      if (currentItem && Number(currentItem.balance))
        resultArr.push(sorobanTokenRecordToPositionCell(currentItem, cryptocurrencyUsdRates))
      return resultArr
    }, [])

    const lendPositions = lendBalances?.reduce((resultArr: PositionCellType[], currentItem) => {
      if (currentItem && Number(currentItem.balance))
        resultArr.push(sorobanTokenRecordToPositionCell(currentItem, cryptocurrencyUsdRates))
      return resultArr
    }, [])

    if (debtPositions?.length || lendPositions?.length)
      setPosition({
        deposits: [...lendPositions] as [PositionCellType, ...PositionCellType[]],
        debts: debtPositions || [],
      })
  }, [setPosition, debtBalances, lendBalances, cryptocurrencyUsdRates])

  const depositsSum = position?.deposits.reduce(
    (sum, currentCell) => sum + (currentCell.valueInUsd || 0),
    0,
  )
  const debtsSum = position?.debts.reduce(
    (sum, currentCell) => sum + (currentCell.valueInUsd || 0),
    0,
  )

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()
  const { modal: lendIncreaseModal, open: openLendIncreaseModal } = useLendIncrease()

  return (
    <div>
      <h2>Positions</h2>
      {position ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div>
            {depositsSum && <h2>{depositsSum?.toFixed(2)}$</h2>}
            <h4>Lend</h4>
            {position.deposits.map((deposit) => {
              if (!deposit) return null
              const { token, value, valueInUsd } = deposit
              const depositPersentage =
                valueInUsd &&
                depositsSum &&
                ` - ${Number((valueInUsd / depositsSum) * 100).toFixed()}%`
              return (
                <div key={token}>
                  <em>
                    {tokens[token]?.title}
                    {position.deposits.length > 1 ? depositPersentage : ''}
                  </em>
                  <br />
                  {value} {token}{' '}
                  {valueInUsd && (
                    <div>
                      <div>
                        <em>50% discount</em>
                      </div>
                      {valueInUsd.toFixed(2)}$
                    </div>
                  )}
                  <button type="button" onClick={() => openLendDecreaseModal(token)}>
                    -
                  </button>
                  <button type="button" onClick={() => openLendIncreaseModal(token)}>
                    +
                  </button>
                </div>
              )
            })}
            <button type="button" onClick={() => openLendIncreaseModal()}>
              + lend more
            </button>
          </div>
          <div>
            {debtsSum && <h2>{debtsSum?.toFixed(2)}$</h2>}
            <h4>Borrowed</h4>
            <div>
              {position.debts.map((debt) => {
                if (!debt) return null
                const { token, value, valueInUsd } = debt
                const depositPersentage =
                  valueInUsd &&
                  depositsSum &&
                  ` - ${Number((valueInUsd / depositsSum) * 100).toFixed()}%`
                return (
                  <div key={token}>
                    <em>
                      {tokens[token]?.title}
                      {position.deposits.length > 1 ? depositPersentage : ''}
                    </em>
                    <br />
                    {value} {token}{' '}
                    <button type="button" onClick={() => openBorrowDecreaseModal(token)}>
                      -
                    </button>
                    <button type="button" onClick={() => openBorrowIncreaseModal(token)}>
                      +
                    </button>
                  </div>
                )
              })}
              <button type="button" onClick={() => openBorrowIncreaseModal()}>
                + debt more
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>empty</>
      )}
      {borrowDecreaseModal}
      {borrowIncreaseModal}
      {lendDecreaseModal}
      {lendIncreaseModal}
    </div>
  )
}
