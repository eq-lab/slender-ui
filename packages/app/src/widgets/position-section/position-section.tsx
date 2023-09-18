import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { useBorrowDecrease } from '@/features/liquidity-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/liquidity-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/liquidity-flow/hooks/use-lend-decrease'
import { useLendIncrease } from '@/features/liquidity-flow/hooks/use-lend-increase'
import { formatPercent, formatUsd } from '@/shared/formatters'
import { SUPPORTED_TOKENS, tokenContracts } from '@/shared/stellar/constants/tokens'
import Label from '@marginly/ui/components/label'
import Typography from '@marginly/ui/components/typography'
import { useMarketData } from '@/entities/token/context/hooks'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { PositionCell } from './components/position-cell'
import {
  PositionHeaderWrapper,
  PositionSumWrapper,
  PositionContainer,
  PositionHeadingContainer,
  PositionSideContainer,
  PositionWrapper,
} from './position-section.styled'

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)

  const marketData = useMarketData()

  const isFullPosition =
    (position?.debts.length || 0) + (position?.deposits.length || 0) === SUPPORTED_TOKENS.length
  const isFullDeposits = position?.deposits.length === SUPPORTED_TOKENS.length

  const depositsSumUsd =
    position?.deposits.reduce((sum, currentCell) => sum + (currentCell.valueInUsd || 0), 0) || 0

  const debtsSumUsd =
    position?.debts.reduce((sum, currentCell) => sum + (currentCell.valueInUsd || 0), 0) || 0

  const positionHealth =
    depositsSumUsd &&
    Math.max(Math.round(depositsSumUsd && (1 - debtsSumUsd / depositsSumUsd) * 100), 0)

  const makeGetSumInterestRate =
    (isDeposit: boolean) => (sum: number, currentDebt: PositionCellType) => {
      const { valueInUsd, tokenName } = currentDebt
      if (!marketData) return sum
      const { address } = tokenContracts[tokenName]
      const { borrowInterestRate, lendInterestRate } = marketData[address] || {}
      const interestRatePercentNum =
        parseInt((isDeposit ? lendInterestRate : borrowInterestRate) || '', 10) || 0
      const fractionInSumUsd = valueInUsd
        ? valueInUsd / (isDeposit ? depositsSumUsd : debtsSumUsd)
        : 0
      return sum + interestRatePercentNum * fractionInSumUsd
    }

  const debtSumInterestRate = position?.debts?.reduce(makeGetSumInterestRate(false), 0) || 0

  const depositSumInterestRate = position?.deposits?.reduce(makeGetSumInterestRate(true), 0) || 0

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()
  const { modal: lendIncreaseModal, open: openLendIncreaseModal } = useLendIncrease()

  return (
    <PositionWrapper>
      <PositionHeaderWrapper>
        <Typography title>Position</Typography>
      </PositionHeaderWrapper>
      {position?.deposits.length || position?.debts.length ? (
        <>
          <div>
            <em>Health: {positionHealth}%</em>
          </div>
          <PositionContainer>
            <PositionSideContainer>
              <PositionHeadingContainer>
                <PositionSumWrapper>
                  {depositsSumUsd && <Typography headerL>{formatUsd(depositsSumUsd)}</Typography>}
                  <Typography secondary>Lent</Typography>
                </PositionSumWrapper>
                <Label positive lg>
                  +{formatPercent(depositSumInterestRate)} APR
                </Label>
              </PositionHeadingContainer>
              {position.deposits.map((deposit) => {
                const { tokenName, valueInUsd } = deposit
                const depositPercentage =
                  valueInUsd && !!depositsSumUsd
                    ? +Number((valueInUsd / depositsSumUsd) * 100).toFixed(1)
                    : undefined
                return (
                  <PositionCell
                    key={tokenName}
                    position={deposit}
                    percentage={depositPercentage}
                    openDecreaseModal={() => openLendDecreaseModal(tokenName)}
                    openIncreaseModal={() => openLendIncreaseModal(tokenName)}
                    isLendPosition
                  />
                )
              })}
              {!isFullPosition && (
                <button type="button" onClick={() => openLendIncreaseModal()}>
                  + lend more
                </button>
              )}
            </PositionSideContainer>
            <PositionSideContainer>
              <PositionHeadingContainer>
                {isFullDeposits ? (
                  <PositionSumWrapper>
                    <Typography headerL>You can’t borrow</Typography>
                    <Typography secondary>
                      Withdraw any collateral asset to be able to borrow
                    </Typography>
                  </PositionSumWrapper>
                ) : (
                  <>
                    <PositionSumWrapper>
                      {debtsSumUsd && <Typography headerL>{formatUsd(debtsSumUsd)}</Typography>}
                      <Typography>Borrowed</Typography>
                    </PositionSumWrapper>
                    <Label negative lg>
                      -{formatPercent(debtSumInterestRate)} APR
                    </Label>
                  </>
                )}
              </PositionHeadingContainer>
              <div>
                {position.debts.map((debt) => {
                  const { tokenName, valueInUsd } = debt
                  const debtPercentage =
                    valueInUsd && debtsSumUsd
                      ? +Number((valueInUsd / debtsSumUsd) * 100).toFixed(1)
                      : undefined

                  return (
                    <PositionCell
                      key={tokenName}
                      position={debt}
                      percentage={debtPercentage}
                      openDecreaseModal={() => openBorrowDecreaseModal(tokenName)}
                      openIncreaseModal={() => openBorrowIncreaseModal(tokenName)}
                    />
                  )
                })}
                {!isFullDeposits && (
                  <button type="button" onClick={() => openBorrowIncreaseModal()}>
                    + lend more
                  </button>
                )}
              </div>
            </PositionSideContainer>
          </PositionContainer>
        </>
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
