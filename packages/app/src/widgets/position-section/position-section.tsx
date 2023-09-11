'use client'

import React, { useEffect } from 'react'
import { tokens, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import { useGetBalance, SorobanTokenRecord } from '@/entities/token/hooks/use-get-balance'
import { WalletContext } from '@/entities/wallet/context/context'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'
import { usePriceInUsd, SupportedTokenRates } from '@/entities/currency-rates/context/hooks'
import { useLendIncrease } from '@/features/borrow-flow/hooks/use-lend-increase'

const sorobanTokenRecordToPositionCell = (
  tokenRecord: SorobanTokenRecord,
  index: number,
  cryptocurrencyUsdRates: SupportedTokenRates,
): PositionCellType => {
  const value = Number(tokenRecord.balance) / 10 ** tokenRecord.decimals
  const token = SUPPORTED_TOKENS[index]!
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
  const cryptocurrencyUsdRates = usePriceInUsd()

  const debtBalances = useGetBalance(
    SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].debtAddress),
    userAddress,
  )
  const lendBalances = useGetBalance(
    SUPPORTED_TOKENS.map((tokenName) => tokens[tokenName].sAddress),
    userAddress,
  )

  // TODO move to provider
  useEffect(() => {
    const debtPositions = debtBalances?.reduce(
      (resultArr: PositionCellType[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance)) {
          resultArr.push(
            sorobanTokenRecordToPositionCell(currentItem, currentIndex, cryptocurrencyUsdRates),
          )
        }
        return resultArr
      },
      [],
    )

    const lendPositions = lendBalances?.reduce(
      (resultArr: PositionCellType[], currentItem, currentIndex) => {
        if (currentItem && Number(currentItem.balance)) {
          resultArr.push(
            sorobanTokenRecordToPositionCell(currentItem, currentIndex, cryptocurrencyUsdRates),
          )
        }
        return resultArr
      },
      [],
    )

    // TODO remove if, don't render empty lists
    if (debtPositions?.length || lendPositions?.length) {
      setPosition({
        deposits: [...lendPositions] as [PositionCellType, ...PositionCellType[]],
        debts: debtPositions || [],
      })
    }
  }, [userAddress, setPosition, debtBalances, lendBalances])

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
        'No positions'
      )}
      {borrowDecreaseModal}
      {borrowIncreaseModal}
      {lendDecreaseModal}
      {lendIncreaseModal}
    </div>
  )
}
