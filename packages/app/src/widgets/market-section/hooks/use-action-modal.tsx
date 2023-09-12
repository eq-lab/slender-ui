import { PositionContext } from '@/entities/position/context/context'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { useContextSelector } from 'use-context-selector'

interface Props {
  tokenName: SupportedToken
  useFirstPosition: (token: SupportedToken) => {
    modal: React.ReactNode
    open: () => void
  }
  useIncrease: () => {
    modal: React.ReactNode
    open: (token: SupportedToken) => void
  }
  type: 'borrow' | 'lend'
}

export const useActionModal = ({
  tokenName,
  useFirstPosition,
  useIncrease,
  type,
}: Props): {
  modal: React.ReactNode
  open: () => void
  disabled: boolean
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const { modal: firstPositionModal, open: firstPositionOpen } = useFirstPosition(tokenName)
  const { modal: increaseModal, open: increaseOpen } = useIncrease()

  const hasSameDeposit = Boolean(
    position?.[type === 'borrow' ? 'deposits' : 'debts']
      .map((cell) => cell.token)
      .includes(tokenName),
  )

  const open = () => {
    if (position) {
      increaseOpen(tokenName)
      return
    }
    firstPositionOpen()
  }

  const modal = position ? increaseModal : firstPositionModal
  return {
    modal,
    open,
    disabled: hasSameDeposit,
  }
}
