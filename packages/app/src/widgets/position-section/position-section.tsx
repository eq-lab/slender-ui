'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { tokens, SupportedToken, SUPPORTED_TOKENS } from '@/shared/stellar/constants/tokens'
import { useGetBalance, SorobanTokenRecord } from '@/entities/token/hooks/use-get-balance'
import { WalletContext } from '@/entities/wallet/context/context'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { mockTokenInfoByType } from '@/shared/stellar/constants/mock-tokens-info'
import { PositionCell } from '@/entities/position/types'
import { BorrowDecreaseModal } from '@/features/borrow-flow/components/borrow-decrease-modal'
import { BorrowIncreaseModal } from '@/features/borrow-flow/components/borrow-increase-modal'
import { excludeSupportedTokens } from '@/features/borrow-flow/utils'
import { StakeDecreaseModal } from '@/features/borrow-flow/components/stake-decrease-modal'
import { getStakeUsd, getDebtUsd, sumObj } from './utils'

const sorobanTokenRecordToPositionCell = (tokenRecord: SorobanTokenRecord): PositionCell => ({
  value: Number(tokenRecord.balance) / 10 ** tokenRecord.decimals,
  type: tokenRecord.symbol.substring(1).toLowerCase() as PositionCell['type'],
})

export function PositionSection() {
  const userAddress = useContextSelector(WalletContext, (state) => state.address)
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [decreaseDebtModalIndex, setDecreaseDebtModalIndex] = useState<0 | 1 | null>(null)
  const [increaseDebtModalIndex, setIncreaseDebtModalIndex] = useState<0 | 1 | null>(null)
  const [decreaseStakeModalIndex, setDecreaseStakeModalIndex] = useState<0 | 1 | null>(null)

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
    const debtPositions = debtBalances?.reduce((resultArr: PositionCell[], currentItem) => {
      if (currentItem && Number(currentItem.balance))
        resultArr.push(sorobanTokenRecordToPositionCell(currentItem))
      return resultArr
    }, [])

    const lendPositions = lendBalances?.reduce((resultArr: PositionCell[], currentItem) => {
      if (currentItem && Number(currentItem.balance))
        resultArr.push(sorobanTokenRecordToPositionCell(currentItem))
      return resultArr
    }, [])

    if (debtPositions?.length || lendPositions?.length)
      setPosition({
        stakes: debtPositions as [PositionCell, ...PositionCell[]],
        debts: lendPositions || [],
      })
  }, [setPosition, debtBalances, lendBalances])

  const getDebtModalData = (modalIndex: 0 | 1 | null) => {
    if (!position || modalIndex === null) return null
    const debt = position.debts[modalIndex]
    if (!debt) return null
    return { debt, availablePosition: position }
  }

  const getStakeModalData = (modalIndex: 0 | 1 | null) => {
    if (!position || modalIndex === null) return null
    const stakes = position.stakes[modalIndex]
    if (!stakes) return null
    return { stakes, availablePosition: position }
  }

  const renderIncreaseDebtModal = () => {
    const modalData = getDebtModalData(increaseDebtModalIndex)
    if (!modalData) return null
    const firstStake = modalData.availablePosition.stakes[0].type
    const secondStake = modalData.availablePosition.stakes[1]?.type
    const secondDebt = modalData.availablePosition.debts[1]?.type

    const getDebtTypes = () => {
      if (secondDebt) {
        return [modalData.debt.type]
      }

      return excludeSupportedTokens(secondStake ? [firstStake, secondStake] : [firstStake])
    }

    const handleSend = (sendValue: Partial<Record<'usdc' | 'xlm' | 'xrp', number>>) => {
      const prevDebtsObj = modalData.availablePosition.debts.reduce(
        (acc, el) => ({
          ...acc,
          [el.type]: el.value,
        }),
        {},
      )
      const finalDebtsObj = sumObj(prevDebtsObj, sendValue)

      const arr = Object.entries(finalDebtsObj).map((entry) => {
        const [key, value] = entry as [SupportedToken, number]
        return {
          type: key,
          value,
        }
      })

      setPosition({
        debts: arr,
        stakes: modalData.availablePosition.stakes,
      })
      setIncreaseDebtModalIndex(null)
    }

    return (
      <BorrowIncreaseModal
        debtTypes={getDebtTypes()}
        stakeSumUsd={getStakeUsd(modalData.availablePosition.stakes)}
        debtSumUsd={getDebtUsd(modalData.availablePosition.debts)}
        type={modalData.debt.type}
        onClose={() => setIncreaseDebtModalIndex(null)}
        onSend={handleSend}
      />
    )
  }

  const renderDecreaseDebtModal = () => {
    const modalData = getDebtModalData(decreaseDebtModalIndex)
    if (!modalData) return null

    const handleSend = (value: PositionCell) => {
      const sendType = value.type
      const prev = modalData.availablePosition.debts
      const newDebts = prev.map((el) => {
        if (el.type === sendType) {
          return { value: el.value - value.value, type: sendType }
        }
        return el
      })
      setPosition({
        debts: newDebts,
        stakes: modalData.availablePosition.stakes,
      })
      setDecreaseDebtModalIndex(null)
    }

    return (
      <BorrowDecreaseModal
        debt={modalData.debt.value}
        debtSumUsd={getDebtUsd(modalData.availablePosition.debts)}
        stakeSumUsd={getStakeUsd(modalData.availablePosition.stakes)}
        type={modalData.debt.type}
        onClose={() => setDecreaseDebtModalIndex(null)}
        onSend={handleSend}
      />
    )
  }

  const renderDecreaseStakeModal = () => {
    const modalData = getStakeModalData(decreaseStakeModalIndex)
    if (!modalData) return null

    const handleSend = (value: PositionCell) => {
      const sendType = value.type
      const prev = modalData.availablePosition.stakes
      const newStakes = prev.map((el) => {
        if (el.type === sendType) {
          return { value: el.value - value.value, type: sendType }
        }
        return el
      })
      setPosition({
        debts: modalData.availablePosition.debts,
        stakes: newStakes as [PositionCell, ...PositionCell[]],
      })
      setDecreaseStakeModalIndex(null)
    }

    return (
      <StakeDecreaseModal
        stake={modalData.stakes.value}
        debtSumUsd={getDebtUsd(modalData.availablePosition.debts)}
        stakeSumUsd={getStakeUsd(modalData.availablePosition.stakes)}
        type={modalData.stakes.type}
        onClose={() => setDecreaseStakeModalIndex(null)}
        onSend={handleSend}
      />
    )
  }

  return (
    <div>
      <div>user xml: {mockTokenInfoByType.xlm.userValue} (FAKE)</div>
      <div>user xrp: {mockTokenInfoByType.xrp.userValue} (FAKE)</div>
      <div>user usdc: {mockTokenInfoByType.usdc.userValue} (FAKE)</div>
      <h2>Positions</h2>
      {position ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div>
            <h4>lend</h4>
            {position.stakes.map((stake, index) => {
              if (!stake) return null
              const { type, value } = stake
              if (index === 0 || index === 1) {
                return (
                  <div key={type}>
                    {value} {type}{' '}
                    <button type="button" onClick={() => setDecreaseStakeModalIndex(index)}>
                      -
                    </button>
                  </div>
                )
              }
              return null
            })}
          </div>
          <div>
            <h4>borrowed</h4>
            <div>
              {position.debts.map((debt, index) => {
                if (!debt) return null
                if (index === 0 || index === 1) {
                  return (
                    <div key={debt.type}>
                      {debt.value} {debt.type}{' '}
                      <button type="button" onClick={() => setDecreaseDebtModalIndex(index)}>
                        -
                      </button>
                      <button type="button" onClick={() => setIncreaseDebtModalIndex(index)}>
                        +
                      </button>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      ) : (
        <>empty</>
      )}
      {renderDecreaseDebtModal()}
      {renderIncreaseDebtModal()}
      {renderDecreaseStakeModal()}
    </div>
  )
}
