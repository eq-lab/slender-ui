import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { useBorrowDecrease } from '@/features/borrow-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/borrow-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/borrow-flow/hooks/use-lend-decrease'
import { useLendIncrease } from '@/features/borrow-flow/hooks/use-lend-increase'
import { formatUsd } from '@/features/borrow-flow/formatters'
import { SUPPORTED_TOKENS, tokenContracts } from '@/shared/stellar/constants/tokens'
import { Typography, H1, H2 } from '@/shared/ui/typography'
import { useMarketData } from '@/entities/token/context/hooks'
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

  const debtSumInterestRate = position?.debts?.reduce((sum, currentDebt) => {
    const { valueInUsd, token } = currentDebt
    if (!marketData) return sum
    const { debtAddress, sAddress } = tokenContracts[token]
    const { borrowInterestRate } = marketData[debtAddress] || {}
    const interestRatePercentNum = parseInt(borrowInterestRate || '', 10) || 0
    const fractionInSumUsd = valueInUsd ? valueInUsd / debtsSumUsd : 0
    return sum + interestRatePercentNum * fractionInSumUsd
  }, 0)

  const depositSumInterestRate = position?.deposits?.reduce((sum, currentDeposit) => {
    const { valueInUsd, token } = currentDeposit
    const interestRatePercentNum =
      (marketData && parseInt(marketData[token]?.lendInterestRate || '', 10)) || 0
    const fractionInSumUsd = valueInUsd ? valueInUsd / depositsSumUsd : 0
    return sum + interestRatePercentNum * fractionInSumUsd
  }, 0)

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()
  const { modal: lendIncreaseModal, open: openLendIncreaseModal } = useLendIncrease()

  return (
    <PositionWrapper>
      <H1>Position</H1>
      <div>
        <em>Health: {positionHealth}%</em>
      </div>
      {position?.deposits.length || position?.debts.length ? (
        <PositionContainer>
          <PositionSideContainer>
            <PositionHeadingContainer>
              {depositsSumUsd && <H2>{formatUsd(depositsSumUsd)}</H2>}
              <Typography>Lent - {debtSumInterestRate}</Typography>
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
              {debtsSumUsd && <H2>{formatUsd(debtsSumUsd)}</H2>}
              <Typography>Borrowed</Typography>
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
