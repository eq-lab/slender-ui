import { useState } from 'react'
import { PositionContext } from '@/entities/position/context/context'
import { useContextSelector } from 'use-context-selector'
import { PositionCell } from '@/entities/position/types'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { getDebtUsd, getStakeUsd } from '../utils'
import { StakeDecreaseModal } from '../components/stake-decrease-modal'

export const useStakeDecrease = () => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const setPosition = useContextSelector(PositionContext, (state) => state.setPosition)
  const [modalType, setModalType] = useState<SupportedToken | null>(null)

  const renderModal = () => {
    if (!position || !modalType) return null
    const stake = position.stakes.find((stakeItem) => stakeItem.type === modalType)
    if (!stake) return null

    const handleSend = ({ type, value }: PositionCell) => {
      const newStakes = position.stakes.map((el) => {
        if (el.type === type) {
          return { value: el.value - value, type }
        }
        return el
      })
      setPosition({
        debts: position.debts,
        stakes: newStakes as [PositionCell, ...PositionCell[]],
      })
      setModalType(null)
    }

    return (
      <StakeDecreaseModal
        stake={stake.value}
        debtSumUsd={getDebtUsd(position.debts)}
        stakeSumUsd={getStakeUsd(position.stakes)}
        type={stake.type}
        onClose={() => setModalType(null)}
        onSend={handleSend}
      />
    )
  }

  return { modal: renderModal(), open: setModalType }
}
