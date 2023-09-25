import React from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { useBorrowDecrease } from '@/features/liquidity-flow/hooks/use-borrow-decrease'
import { useBorrowIncrease } from '@/features/liquidity-flow/hooks/use-borrow-increase'
import { useLendDecrease } from '@/features/liquidity-flow/hooks/use-lend-decrease'
import { useLendIncrease } from '@/features/liquidity-flow/hooks/use-lend-increase'
import { HealthMeter } from '@/shared/components/health-meter'
import { formatPercent, formatUsd } from '@/shared/formatters'
import { SUPPORTED_TOKEN_NAMES, tokenContracts } from '@/shared/stellar/constants/tokens'
import Label from '@marginly/ui/components/label'
import Typography from '@marginly/ui/components/typography'
import { useMarketData } from '@/entities/token/context/hooks'
import { PositionCell as PositionCellType } from '@/entities/position/types'
import { PositionCell } from './components/position-cell'
import { MoreButton } from './components/more-button'
import * as S from './position-section.styled'

export function PositionSection() {
  const position = useContextSelector(PositionContext, (state) => state.position)

  const marketData = useMarketData()

  const isFullPosition =
    (position.debts.length || 0) + (position.deposits.length || 0) === SUPPORTED_TOKEN_NAMES.length
  const isFullDeposits = position.deposits.length === SUPPORTED_TOKEN_NAMES.length

  const depositsSumUsd =
    position.deposits.reduce((sum, { valueInUsd }) => sum + (valueInUsd || 0), 0) || 0

  const debtsSumUsd =
    position.debts.reduce((sum, currentCell) => sum + (currentCell.valueInUsd || 0), 0) || 0

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

  const debtSumInterestRate = position.debts.reduce(makeGetSumInterestRate(false), 0) || 0

  const depositSumInterestRate = position.deposits.reduce(makeGetSumInterestRate(true), 0) || 0

  const { modal: borrowDecreaseModal, open: openBorrowDecreaseModal } = useBorrowDecrease()
  const { modal: borrowIncreaseModal, open: openBorrowIncreaseModal } = useBorrowIncrease()
  const { modal: lendDecreaseModal, open: openLendDecreaseModal } = useLendDecrease()
  const { modal: lendIncreaseModal, open: openLendIncreaseModal } = useLendIncrease()

  if (!position.deposits.length && !position.debts.length) return null

  return (
    <S.PositionWrapper>
      <S.PositionHeaderWrapper>
        <Typography title>Position</Typography>
        <HealthMeter healthPercent={positionHealth} />
      </S.PositionHeaderWrapper>
      <S.PositionContainer>
        <S.PositionSideContainer>
          <S.PositionHeadingContainer>
            <S.PositionSumWrapper>
              <S.PositionSumContainer>
                {depositsSumUsd && <Typography headerL>{formatUsd(depositsSumUsd)}</Typography>}
                <Label positive lg>
                  +{formatPercent(depositSumInterestRate)} APR
                </Label>
              </S.PositionSumContainer>
              <Typography secondary>Lent</Typography>
            </S.PositionSumWrapper>
          </S.PositionHeadingContainer>
          <S.PositionCellContainer>
            {position.deposits.map((deposit) => {
              const { tokenName, valueInUsd = 0 } = deposit
              const depositPercentage =
                !!valueInUsd && !!depositsSumUsd
                  ? +Number((valueInUsd / depositsSumUsd) * 100).toFixed(1)
                  : undefined
              return (
                <PositionCell
                  key={tokenName}
                  valueInUsd={valueInUsd}
                  position={deposit}
                  percentage={depositPercentage}
                  openDecreaseModal={() => openLendDecreaseModal(tokenName)}
                  openIncreaseModal={() => openLendIncreaseModal(tokenName)}
                  isLendPosition
                />
              )
            })}
            {!isFullPosition && (
              <MoreButton
                upperText="Lend More"
                bottomText="Increase Borrow Limit"
                onClick={() => openLendIncreaseModal()}
              />
            )}
          </S.PositionCellContainer>
        </S.PositionSideContainer>
        <S.PositionSideContainer>
          <S.PositionHeadingContainer>
            {isFullDeposits ? (
              <S.PositionSumWrapper>
                <Typography headerL>You can’t borrow</Typography>
                <Typography secondary>
                  Withdraw any collateral asset to be able to borrow
                </Typography>
              </S.PositionSumWrapper>
            ) : (
              <S.PositionSumWrapper>
                <S.PositionSumContainer>
                  <Typography headerL>
                    {debtsSumUsd ? formatUsd(debtsSumUsd) : 'No debt'}
                  </Typography>
                  <Label negative lg>
                    &minus;{formatPercent(debtSumInterestRate)} APR
                  </Label>
                </S.PositionSumContainer>
                {debtsSumUsd && (
                  <Typography secondary>
                    {debtsSumUsd ? 'Borrowed' : 'You earn on deposit'}
                  </Typography>
                )}
              </S.PositionSumWrapper>
            )}
          </S.PositionHeadingContainer>
          <S.PositionCellContainer>
            {position.debts.map((debt) => {
              const { tokenName, valueInUsd = 0 } = debt
              const debtPercentage =
                valueInUsd && debtsSumUsd
                  ? +Number((valueInUsd / debtsSumUsd) * 100).toFixed(1)
                  : undefined

              return (
                <PositionCell
                  key={tokenName}
                  valueInUsd={valueInUsd}
                  position={debt}
                  percentage={debtPercentage}
                  openDecreaseModal={() => openBorrowDecreaseModal(tokenName)}
                  openIncreaseModal={() => openBorrowIncreaseModal(tokenName)}
                />
              )
            })}
            {!isFullDeposits && (
              <MoreButton
                upperText="Borrow More"
                bottomText={`Up to ${formatUsd(depositsSumUsd - debtsSumUsd)}`}
                onClick={() => openBorrowIncreaseModal()}
              />
            )}
          </S.PositionCellContainer>
        </S.PositionSideContainer>
      </S.PositionContainer>
      {borrowDecreaseModal}
      {borrowIncreaseModal}
      {lendDecreaseModal}
      {lendIncreaseModal}
    </S.PositionWrapper>
  )
}
