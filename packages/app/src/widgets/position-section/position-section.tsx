import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'
import { useLendIncrease } from '@/features/borrow-flow/hooks/use-lend-increase'
import { formatUsd, formatPercent } from '@/shared/formatters'
import { SUPPORTED_TOKENS, tokenContracts } from '@/shared/stellar/constants/tokens'
import Typography from '@marginly/ui/components/typography'
import { useMarketData } from '@/entities/token/context/hooks'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { PositionCell } from './components/position-cell'
import {
  PositionWrapper,
  PositionContainer,
  PositionSideContainer,
  PositionHeadingContainer,
} from './position.styled'

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)

  const marketData = useMarketData()

  const isFullPosition =
    (position?.debts.length || 0) + (position?.deposits.length || 0) === SUPPORTED_TOKENS.length
  const isFullDeposits = position?.deposits.length === SUPPORTED_TOKENS.length

  const showLendMore = !isFullPosition
  const showDebtMore = !isFullDeposits

  const depositsSumUsd =
    position?.deposits.reduce((sum, currentCell) => sum + (currentCell.valueInUsd || 0), 0) || 0

  const debtsSumUsd =
    position?.debts.reduce((sum, currentCell) => sum + (currentCell.valueInUsd || 0), 0) || 0

  const positionHealth =
    depositsSumUsd &&
    Math.max(Math.round(depositsSumUsd && (1 - debtsSumUsd / depositsSumUsd) * 100), 0)

  const makeSumInterestRateReduce =
    (isDeposit: boolean) => (sum: number, currentDebt: PositionCellType) => {
      const { valueInUsd, token } = currentDebt
      if (!marketData) return sum
      const { address } = tokenContracts[token]
      const { borrowInterestRate, lendInterestRate } = marketData[address] || {}
      const interestRatePercentNum =
        parseInt((isDeposit ? lendInterestRate : borrowInterestRate) || '', 10) || 0
      const fractionInSumUsd = valueInUsd
        ? valueInUsd / (isDeposit ? depositsSumUsd : debtsSumUsd)
        : 0
      return sum + interestRatePercentNum * fractionInSumUsd
    }

  const debtSumInterestRate = position?.debts?.reduce(makeSumInterestRateReduce(false), 0) || 0

  const depositSumInterestRate = position?.deposits?.reduce(makeSumInterestRateReduce(true), 0) || 0

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()
  const { modal: lendIncreaseModal, open: openLendIncreaseModal } = useLendIncrease()

  return (
    <PositionWrapper>
      <Typography>Position</Typography>
      <div>
        <em>Health: {positionHealth}%</em>
      </div>
      {position?.deposits.length || position?.debts.length ? (
        <PositionContainer>
          <PositionSideContainer>
            <PositionHeadingContainer>
              {depositsSumUsd && <Typography>{formatUsd(depositsSumUsd)}</Typography>}
              <Typography>Lent</Typography>
              <Typography>+{formatPercent(depositSumInterestRate)} APR</Typography>
            </PositionHeadingContainer>
            {position.deposits.map((deposit) => {
              const { token, valueInUsd } = deposit
              const depositPersentage =
                valueInUsd && !!depositsSumUsd
                  ? +Number((valueInUsd / depositsSumUsd) * 100).toFixed(1)
                  : undefined
              return (
                <PositionCell
                  key={token}
                  position={deposit}
                  percentage={depositPersentage}
                  openDecreaseModal={() => openLendDecreaseModal(token)}
                  openIncreaseModal={() => openLendIncreaseModal(token)}
                  isLendPosition
                />
              )
            })}
            {showLendMore && (
              <button type="button" onClick={() => openLendIncreaseModal()}>
                + lend more
              </button>
            )}
          </PositionSideContainer>
          <PositionSideContainer>
            <PositionHeadingContainer>
              {debtsSumUsd && <Typography>{formatUsd(debtsSumUsd)}</Typography>}
              <Typography>Borrowed</Typography>
              <Typography>-{formatPercent(debtSumInterestRate)} APR</Typography>
            </PositionHeadingContainer>
            <div>
              {position.debts.map((debt) => {
                const { token, valueInUsd } = debt
                const debtPersentage =
                  valueInUsd && debtsSumUsd
                    ? +Number((valueInUsd / debtsSumUsd) * 100).toFixed(1)
                    : undefined

                return (
                  <PositionCell
                    key={token}
                    position={debt}
                    percentage={debtPersentage}
                    openDecreaseModal={() => openBorrowDecreaseModal(token)}
                    openIncreaseModal={() => openBorrowIncreaseModal(token)}
                  />
                )
              })}
              {showDebtMore && (
                <button type="button" onClick={() => openBorrowIncreaseModal()}>
                  + lend more
                </button>
              )}
            </div>
          </PositionSideContainer>
        </PositionContainer>
      ) : (
        'No positions'
      )}
      {borrowDecreaseModal}
      {borrowIncreaseModal}
      {lendDecreaseModal}
      {lendIncreaseModal}
    </PositionWrapper>
  )
}
