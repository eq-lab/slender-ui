import { PositionContext } from '@/entities/position/context/context'
import { SupportedToken } from '@/shared/stellar/constants/tokens'
import { useContextSelector } from 'use-context-selector'

interface Props {
  tokenName: SupportedToken
  useFirstPosition: (token: SupportedToken) => {
    modal: JSX.Element | null
    open: () => void
  }
  useIncrease: () => {
    modal: JSX.Element | null
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
  modal: JSX.Element | null
  open: () => void
  disabled: boolean
} => {
  const position = useContextSelector(PositionContext, (state) => state.position)
  const { modal: firstPositionModal, open: firstPositionOpen } = useFirstPosition(tokenName)
  const { modal: increaseModal, open: increaseOpen } = useIncrease()

  const havePosition = Boolean(position.debts.length || position.deposits.length)

  const disabled = Boolean(
    position?.[type === 'borrow' ? 'deposits' : 'debts']
      .map((cell) => cell.tokenName)
      .includes(tokenName),
  )

  const open = () => {
    if (havePosition) {
      increaseOpen(tokenName)
      return
    }
    firstPositionOpen()
  }

  const modal = havePosition ? increaseModal : firstPositionModal
  return {
    modal,
    open,
    disabled,
  }
}
