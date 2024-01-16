import { PositionContext } from '@/entities/position/context/context';
import { checkPositionExists } from '@/entities/position/utils';
import { useOpenModalAfterAuthentication } from '@/features/liquidity-flow/hooks/use-open-modal-after-autefication';
import { SupportedTokenName } from '@/shared/stellar/constants/tokens';
import { useContextSelector } from 'use-context-selector';

interface Props {
  tokenName: SupportedTokenName;
  useFirstPosition: (token: SupportedTokenName) => {
    modal: JSX.Element | null;
    open: () => void;
  };
  useIncrease: () => {
    modal: JSX.Element | null;
    open: (token: SupportedTokenName) => void;
  };
  type: 'borrow' | 'lend';
}

export const useActionModal = ({
  tokenName,
  useFirstPosition,
  useIncrease,
  type,
}: Props): {
  modal: JSX.Element | null;
  open: () => void;
  disabled: boolean;
} => {
  const position = useContextSelector(PositionContext, (state) => state.position);
  const { modal: firstPositionModal, open: firstPositionOpen } = useFirstPosition(tokenName);
  const { modal: increaseModal, open: increaseOpen } = useIncrease();

  const havePosition = checkPositionExists(position);

  const disabled = Boolean(
    position?.[type === 'borrow' ? 'deposits' : 'debts']
      .map((cell) => cell.tokenName)
      .includes(tokenName),
  );

  const runAfterAuthentication = useOpenModalAfterAuthentication(disabled);

  const open = () => {
    runAfterAuthentication((havePositionArg: boolean) => {
      if (havePositionArg) {
        increaseOpen(tokenName);
        return;
      }
      firstPositionOpen();
    });
  };

  const modal = havePosition ? increaseModal : firstPositionModal;
  return {
    modal,
    open,
    disabled,
  };
};
